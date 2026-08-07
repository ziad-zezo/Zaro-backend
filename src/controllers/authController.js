import User from '../models/User.js'
import jwt from 'jsonwebtoken'



export const registerNewUser = async (req, res) => {
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

const signToken = (id, email) => {
    return jwt.sign({ id: id, email: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide both email and password.'
            });

        }
        //check if the user exist
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password.'
            });
        }

        //generate jwt
        const token = signToken(user._id,email);

        user.password = undefined;//to hide the passowrd from response

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully.',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });




    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
