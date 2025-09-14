const pool = require('../config/db');

// --- Get All Tools ---
exports.getAllTools = async (req, res) => {
    try {
        const allTools = await pool.query(
            "SELECT * FROM tools WHERE is_archived = FALSE ORDER BY name ASC"
        );
        res.json(allTools.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Add a New Tool ---
exports.addTool = async (req, res) => {
    const { name, category, serial_number, purchase_date } = req.body;
    try {
        const newTool = await pool.query(
            `INSERT INTO tools (name, category, serial_number, purchase_date) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, category, serial_number, purchase_date]
        );
        res.status(201).json(newTool.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Issue a Tool (MODIFIED for no login) ---
exports.issueTool = async (req, res) => {
    const { toolId, condition_on_issue, operatorId } = req.body;

    if (!toolId || !operatorId) {
        return res.status(400).json({ msg: 'Tool ID and Operator ID are required' });
    }
    try {
        await pool.query('BEGIN');
        const updateToolQuery = `
            UPDATE tools 
            SET status = 'in_use', current_operator_id = $1 
            WHERE id = $2 AND status = 'available'
            RETURNING *;
        `;
        const updatedTool = await pool.query(updateToolQuery, [operatorId, toolId]);
        if (updatedTool.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ msg: 'Tool not found or is already in use' });
        }
        
        const logTransactionQuery = `
            INSERT INTO transactions (tool_id, operator_id, transaction_type, condition_on_issue) 
            VALUES ($1, $2, 'issue', $3);
        `;
        await pool.query(logTransactionQuery, [toolId, operatorId, condition_on_issue]);

        await pool.query('COMMIT');
        res.json({ msg: 'Tool issued successfully', tool: updatedTool.rows[0] });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Return a Tool (MODIFIED for no login) ---
exports.returnTool = async (req, res) => {
    const { toolId, condition_on_return, notes, operatorId } = req.body;

    if (!toolId || !operatorId) {
        return res.status(400).json({ msg: 'Tool ID and Operator ID are required' });
    }
    try {
        await pool.query('BEGIN');
        const issueTransactionResult = await pool.query(
            `SELECT timestamp FROM transactions 
             WHERE tool_id = $1 AND transaction_type = 'issue' 
             ORDER BY timestamp DESC LIMIT 1`,
            [toolId]
        );
        if (issueTransactionResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ msg: 'No corresponding issue transaction found for this tool.' });
        }
        const issueTime = issueTransactionResult.rows[0].timestamp;
        const returnTime = new Date();
        const duration = (returnTime - issueTime) / 1000;

        const updateToolQuery = `
            UPDATE tools 
            SET status = 'available', 
                current_operator_id = NULL,
                total_usage_duration = total_usage_duration + ($1 * interval '1 second')
            WHERE id = $2 AND status = 'in_use'
            RETURNING *;
        `;
        const updatedTool = await pool.query(updateToolQuery, [duration, toolId]);
        if (updatedTool.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ msg: 'Tool not found or was not in use' });
        }
        const logTransactionQuery = `
            INSERT INTO transactions (tool_id, operator_id, transaction_type, condition_on_return, notes) 
            VALUES ($1, $2, 'return', $3, $4);
        `;
        await pool.query(logTransactionQuery, [toolId, operatorId, condition_on_return, notes]);
        await pool.query('COMMIT');
        res.json({ msg: 'Tool returned successfully', tool: updatedTool.rows[0] });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Archive a Tool (Soft Delete) ---
exports.deleteTool = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE tools SET is_archived = TRUE WHERE id = $1 RETURNING id",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.json({ message: 'Tool archived successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get a Tool's Full Transaction History ---
exports.getToolHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const historyQuery = `
            SELECT 
                t.id as transaction_id, 
                t.transaction_type, 
                t.timestamp,
                t.condition_on_issue,
                t.condition_on_return,
                t.notes,
                op.name as operator_name 
            FROM transactions t
            JOIN operators op ON t.operator_id = op.id
            WHERE t.tool_id = $1
            ORDER BY t.timestamp DESC;
        `;
        
        const historyResult = await pool.query(historyQuery, [id]);
        
        res.json(historyResult.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get Maintenance Flag Report ---
exports.getMaintenanceReport = async (req, res) => {
    try {
        const damageThreshold = 3; 

        const query = `
            SELECT
                t.id,
                t.name,
                t.serial_number,
                COUNT(tr.id) as damaged_return_count
            FROM
                tools t
            JOIN
                transactions tr ON t.id = tr.tool_id
            WHERE
                tr.condition_on_return = 'damaged'
            GROUP BY
                t.id
            HAVING
                COUNT(tr.id) >= $1
            ORDER BY
                damaged_return_count DESC;
        `;
        
        const report = await pool.query(query, [damageThreshold]);
        
        res.json(report.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};