import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive number']
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required: [true, 'Product category is required'],
            trim: true
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0
        },
        brand: {
            type: String,
            trim: true,
            default: 'Generic'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        // Automatically handles createdAt and updatedAt timestamps
        timestamps: true
    }
);

productSchema.index({ name: 'text', description: 'text' });
const Product = mongoose.model("Product", productSchema);
export default Product;