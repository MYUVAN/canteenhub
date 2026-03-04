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

        // 1. Check if user already exists
        let user = db.users.find(u => u.studentId === studentId);

        if (!user) {
            // 2. If user doesn't exist, Auto-Register them!
            // Generate a simple unique _id and assigned name
            const newId = Date.now().toString();
            user = {
                _id: newId,
                name: `Student ${studentId}`, // Simple default name
                studentId: studentId,
                password: password, // For demo purposes, we are just storing plain text since this is a local mock DB
                role: 'student'
            };

            // Add to database
            db.users.push(user);
            saveDb(db);
        } else {
            // 3. If user exists, optionally verify password (simple plain text verfication for demo)
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid password for this existing student ID' });
            }
        }

        // 4. Return success and token
        res.json({
            _id: user._id,
            name: user.name,
            studentId: user.studentId,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
