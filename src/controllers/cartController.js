import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or inactive'
            });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        //check if this product already in the cart 
        const itemIndex = cart.items.findIndex((item) =>
            item.product.toString() === productId
        );
        const targetQuantity = itemIndex > -1 ? cart.items[itemIndex].quantity + quantity : quantity;
        //check stock 
        if (product.stock < targetQuantity) {
            return res.status(404).json({
                success: false,
                message: 'Only ${product.stock} items in stock'
            });
        }
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = targetQuantity;
        } else {
            cart.items.push({ product: productId, quantity: targetQuantity })
        }
        await cart.save();
        await cart.populate('items.product', 'name price images stock');
        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate('items.product', 'name price images stock');

        res.status(200).json({
            success: true,
            data: updatedCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
};