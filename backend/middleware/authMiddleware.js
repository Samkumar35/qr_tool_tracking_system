// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// --- Protect: only logged-in users ---
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // decoded looks like: { user: { id, role }, iat, exp }
            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- Admin Only: restrict to admins ---
const adminOnly = (req, res, next) => {
    if (req.user && req.user.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access is restricted to administrators' });
    }
};

module.exports = { protect, adminOnly };
