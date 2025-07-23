import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to request object
        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(401).json({ message: 'Authentication failed' });
    }
};

export default authMiddleware;