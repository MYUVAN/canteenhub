import jwt from 'jsonwebtoken';
import { getDb } from '../server.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    res.status(400).json({ message: 'Registration disabled. Use default demo accounts.' });
};

export const authUser = async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const db = getDb();

        // Simple plain text check for demo purposes (accepts *any* password so the demo doesn't block the user)
        const user = db.users.find(u => u.studentId === studentId);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                studentId: user.studentId,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid student ID or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
