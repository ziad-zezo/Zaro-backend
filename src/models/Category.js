import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const categorySchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            maxlength: [50, 'Category name cannot exceed 50 characters']
        },
        description: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }

);

const Category=mongoose.model('Category',categorySchema);
export default Category;