import Order from '../models/Order.js';
import Address from '../models/Address.js';



export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderItems, shippingAddressId, paymentMethod } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided'
            });
        }
        //get the address
        const address = await Address.findById(shippingAddressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Shipping address not found'
            });
        }
        //check if the address is belongs to the same user 
        if (address.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to use this address'
            });
        }

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
        //calc the total price 
        const totalPrice = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        // 4. Create the order
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress: shippingAddressSnapshot,
            paymentMethod,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
export const getMyOrders = async (req, res) => {
    try {
        // Uses the compound index { user: 1, createdAt: -1 } we set up
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email'); // Populates user details if needed

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Make sure the user is only fetching their own order (unless they are an admin)
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'paid';
        order.paidAt = Date.now();
        // You might also want to save payment gateway transaction IDs here if you add a field for it

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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
            return res.status(400).json({ message: 'Invalid order status' });
        }

        order.orderStatus = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};