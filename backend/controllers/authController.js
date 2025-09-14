const pool = require('../config/db');

// --- User Registration (now includes role) ---
exports.register = async (req, res) => {
  try {
    const { name, employee_id, role } = req.body;

    const newUser = await pool.query(
      "INSERT INTO operators (name, employee_id, role) VALUES ($1, $2, $3) RETURNING id, name, employee_id, role",
      [name, employee_id, role || 'operator']
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Get All Operators (now includes role) ---
exports.getAllOperators = async (req, res) => {
    try {
        const query = `
            SELECT 
                op.id, 
                op.name, 
                op.employee_id,
                op.role,
                COUNT(t.id) as tools_checked_out
            FROM 
                operators op
            LEFT JOIN 
                tools t ON op.id = t.current_operator_id
            GROUP BY 
                op.id
            ORDER BY 
                op.name;
        `;
        const operators = await pool.query(query);
        res.json(operators.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get Only Operators (now correctly filters by role) ---
exports.getOnlyOperators = async (req, res) => {
    try {
        const query = `
            SELECT 
                id, 
                name, 
                employee_id
            FROM 
                operators
            WHERE
                role = 'operator'
            ORDER BY 
                name;
        `;
        const operators = await pool.query(query);
        res.json(operators.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};