import Category from '../models/Category.js';


export const getAllCategories = async (req, res) => {
    try {

        const categories = await Category.find();
        //check if there are no category
        return res.status(200).json({
            success: 'true',
            data: categories,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


export const addNewCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists'
            });
        }

        const newCategory = await Category.create({
            name,
            description,
            image
        });


        return res.status(201).json({
            success: true,
            data: newCategory
        });

    } catch (error) {
        // Handle Mongoose duplicate key error (fallback)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category name must be unique'
            });
        }

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Catch-all internal server error
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};