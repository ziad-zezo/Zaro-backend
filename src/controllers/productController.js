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
                message: "Provid at least 1 image"
            });
        }
        return res.send("test");
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
            message: "Internal server error",
            errorMessage: error.message
        });
    }
};
