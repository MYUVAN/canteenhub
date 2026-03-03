import { getDb, saveDb } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

export const getMenu = async (req, res) => {
    try {
        const db = getDb();
        res.json(db.foodItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFoodItem = async (req, res) => {
    try {
        const { name, price, image, category, isAvailable } = req.body;
        const db = getDb();

        const newItem = {
            _id: uuidv4(),
            name,
            price,
            image,
            category,
            isAvailable,
            createdAt: new Date().toISOString()
        };

        db.foodItems.push(newItem);
        saveDb(db);

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateFoodItem = async (req, res) => {
    try {
        const { name, price, image, category, isAvailable } = req.body;
        const db = getDb();

        const itemIndex = db.foodItems.findIndex(i => i._id === req.params.id);

        if (itemIndex > -1) {
            db.foodItems[itemIndex] = {
                ...db.foodItems[itemIndex],
                ...req.body
            };
            saveDb(db);
            res.json(db.foodItems[itemIndex]);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFoodItem = async (req, res) => {
    try {
        const db = getDb();
        const itemIndex = db.foodItems.findIndex(i => i._id === req.params.id);

        if (itemIndex > -1) {
            db.foodItems.splice(itemIndex, 1);
            saveDb(db);
            res.json({ message: 'Food item removed' });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
