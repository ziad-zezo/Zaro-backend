import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Cart from '../models/Cart.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';


export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    'Your cart is empty. Please add items to your cart before placing an order.'
            });
        }

        const { shippingAddressId, paymentMethod } = req.body;

        // Validate shipping address ID
        if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid shipping address ID'
            });
        }

        // Get the address
        const address = await Address.findById(shippingAddressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Shipping address not found'
            });
        }

        // Make sure the address belongs to the logged-in user
        if (address.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to use this address'
            });
        }

        // Create address snapshot
        const shippingAddressSnapshot = {
            fullName: address.fullName,
            phone: address.phone,
            country: address.country,
            city: address.city,
            street: address.street,
            building: address.building,
            apartment: address.apartment,
            postalCode: address.postalCode,
        };

        // Build order items from the populated Product documents
        const orderItems = cart.items.map(item => {
            const product = item.product;

            if (!product) {
                throw new Error(
                    `Product ${item.product} no longer exists`
                );
            }

            return {
                product: product.id,
                title: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        // Calculate total
        const totalPrice = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        // Create order
        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress: shippingAddressSnapshot,
            paymentMethod,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            createdOrder
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure the user is only fetching their own order (unless they are an admin)
        if (order.user.id.toString() !== req.user.id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.paymentStatus = 'paid';
        order.paidAt = Date.now();
        // You might also want to save payment gateway transaction IDs here if you add a field for it

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the requested status is valid based on your Enum
        const validStatuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        order.orderStatus = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};