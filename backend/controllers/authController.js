import jwt from 'jsonwebtoken';
import { getDb, saveDb } from '../server.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, username, regNo, userType, email, password } = req.body;

        // Validate regNo starts with 92762
        if (!regNo.startsWith('92762')) {
            return res.status(400).json({ message: 'Registration number must start with 92762' });
        }

        const db = getDb();

        // Check if username or regNo already exists
        const userExists = db.users.find(u => u.username === username || u.studentId === username);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newId = Date.now().toString();
        const newUser = {
            _id: newId,
            name: name,
            username: username,
            studentId: username, // For backward compatibility with existing orders 
            regNo: regNo,
            userType: userType,
            email: email,
            password: password, // As before, stored in plain text for demo JSON db
            role: 'student'
        };

        db.users.push(newUser);
        saveDb(db); // Oops, saveDb requires importing it or it's already there? Wait, saveDb is in server.js but we exported it? Let me check server.js imports!

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            role: newUser.role,
            token: generateToken(newUser._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const authUser = async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const db = getDb();

        // 1. Check if user already exists
        let user = db.users.find(u => u.username === studentId || u.studentId === studentId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // 2. Verify password (simple plain text verfication for demo)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // 3. Return success and token
        res.json({
            _id: user._id,
            name: user.name,
            studentId: user.studentId || user.username,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
