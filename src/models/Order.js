import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderItemSchema = new Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required'],
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Item price is required'],
            min: [0, 'Price cannot be negative'],
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less than 1'],
            default: 1,
        },
    },
    { _id: false }
);

const OrderShippingAddressSchema = new Schema(
    {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        building: { type: String, required: true, trim: true },
        apartment: { type: String, trim: true },
        postalCode: { type: String, trim: true },
    },
    { _id: false }
);

const OrderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
            index: true,
        },
        items: {
            type: [OrderItemSchema],
            validate: [
                (val) => val.length > 0,
                'Order must contain at least one item',
            ],
        },
        shippingAddress: {
            type: OrderShippingAddressSchema,
            required: [true, 'Shipping address snapshot is required'],
        },
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0, 'Total price cannot be negative'],
        },
        paymentMethod: {
            type: String,
            required: [true, 'Payment method is required'],
            enum: ['card', 'cash_on_delivery', 'paypal', 'wallet'],
            default: 'cash_on_delivery',
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        },
        deliveredAt: {
            type: Date,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

OrderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;