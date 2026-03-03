import { getDb, saveDb } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

const generateTokenNumber = (db) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = db.orders.filter(o => new Date(o.createdAt) >= startOfDay);
    return todayOrders.length + 1;
};

export const addOrderItems = async (req, res) => {
    try {
        const { orderItems, totalPrice } = req.body;
        const db = getDb();

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const tokenNumber = generateTokenNumber(db);

        const newOrder = {
            _id: uuidv4(),
            orderItems,
            user: req.user, // Store full user object info locally to avoid populate logic 
            totalPrice,
            tokenNumber,
            status: 'Ordered',
            createdAt: new Date().toISOString()
        };

        db.orders.push(newOrder);
        saveDb(db);

        // Notify owner via Socket.io
        const io = req.app.get('io');
        io.emit('new-order', newOrder);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const db = getDb();
        const order = db.orders.find(o => o._id === req.params.id);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const db = getDb();
        const orders = db.orders
            .filter(o => o.user._id === req.user._id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const db = getDb();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const orders = db.orders
            .filter(o => new Date(o.createdAt) >= startOfDay)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // FIFO format

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const db = getDb();
        const orderIndex = db.orders.findIndex(o => o._id === req.params.id);

        if (orderIndex > -1) {
            db.orders[orderIndex].status = req.body.status || db.orders[orderIndex].status;
            saveDb(db);

            const updatedOrder = db.orders[orderIndex];

            // Notify specific user via Socket.io
            const io = req.app.get('io');
            io.emit(`order-status-${updatedOrder.user._id}`, updatedOrder);

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
