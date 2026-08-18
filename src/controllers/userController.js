// controllers/userController.js

import User from "../models/User.js";
import jwt from 'jsonwebtoken';



export const profile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        //if the no users found
        if (Object.keys(users).length === 0) {
            return res.status(404).json({
                message: "No Users Found!"
            })
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await User.find();
        const user = users.find((user) => user.id == userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided for update!" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" })
        }
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
export const deleteUser = async (req, res) => {
    try {
        //check if the user exists
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {//if the user not found
            return res.status(404).json({ message: "User not Found!" })
        }
        const DeletedUser = await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User Deleted Successfully",
            user: deleteUser
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

