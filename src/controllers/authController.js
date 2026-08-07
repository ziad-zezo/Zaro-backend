import User from '../models/User.js'



const registerNewUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please proide name, email, and password."
            })
        }
        //check if this user already exist
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "Email address is already registered."
            });
        }
        const newUser = new User(
            {
                name,
                email,
                password
            }
        );
        newUser.save();
        res.status(201).json({
            status: 'success',
            message: 'User created successfully.',
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    createdAt: newUser.createdAt
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export default registerNewUser