import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(express.json());

// Setup Simple File-Based DB since MongoDB is unavailable
const dbFile = path.resolve('db.json');

// Initialize DB file if it doesn't exist
const defaultData = {
    users: [
        { _id: '1', name: 'Demo Student', studentId: 'stu123', password: 'password', role: 'student' },
        { _id: '2', name: 'Admin User', studentId: 'admin', username: 'admin', password: '2067', role: 'admin' }
    ],
    foodItems: [
        { _id: '1', name: 'Masala Dosa', price: 60, category: 'Meals', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isAvailable: true },
        { _id: '2', name: 'Veg Noodles', price: 80, category: 'Meals', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isAvailable: true },
        { _id: '3', name: 'Chicken Biryani', price: 150, category: 'Meals', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isAvailable: true },
        { _id: '4', name: 'Cold Coffee', price: 50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isAvailable: true }
    ],
    orders: []
};

if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2));
}

// Temporary JSON Database Helper Methods
export const getDb = () => JSON.parse(fs.readFileSync(dbFile, 'utf8'));
export const saveDb = (data) => fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

console.log('Using Local JSON File Database (db.json)');

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io);

// Serve frontend static files
const frontendDistPath = path.resolve('../frontend/dist');
app.use('/canteenhub', express.static(frontendDistPath));

// Fallback for single-page app routing
app.get(/^\/canteenhub\/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Default route redirect
app.get('/', (req, res) => {
    res.redirect('/canteenhub/');
});

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
