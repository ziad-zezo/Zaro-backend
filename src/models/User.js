import mongoose, { mongo } from 'mongoose'
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Excludes password from query results by default
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    }, { timestamps: true }
);

//hash the Password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    //next();
});
//check password for login
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);
export default User;