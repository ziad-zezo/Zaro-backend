import Category from '../models/Category.js';
import Product from '../models/Product.js';




export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(
            {
                success: true,
                count: products.length(),
                data: products
            }
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const addNewProduct = async (req, res) => {
    try {

        const { name, description, price, images, category, stock, brand, isActive } = req.body;
        if (!name.trim()) {
            return res.status(500).json({
                success: false,
                message: "Product name is required"
            });
        }
        if (images.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Provide at least 1 image"
            });
        }
        if (!price) {
            return res.status(500).json({
                success: false,
                message: "Product price is required"
            });
        }
        if (!stock) {
            return res.status(500).json({
                success: false,
                message: "Product stock is required"
            });
        }
        if (images.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Provide at least 1 image"
            });
        }
        //check if the category exist
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Product category not provided, or not found"
            });
        }

        const newProduct = await Product.create(
            {
                name,
                description,
                price,
                images,
                category,
                stock,
                brand
            }
        )

        res.status(201).json(
            {
                success: true,
                data: newProduct
            }
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            errorMessage: error.message
        });
    }
};
