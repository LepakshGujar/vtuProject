import User from "../models/User.js";
import {
    hashPassword,
    comparePassword
} from "../utils/hashPassword.js";

import generateToken from "../utils/generateToken.js";
import validator from "validator";

// Register
export const registerUser = async (req, res) => {

    try {

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        const safeUser = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            education: user.education,
            experience: user.experience,
            preferredRole: user.preferredRole,
            preferredLocation: user.preferredLocation,
            skills: user.skills
        };

        res.status(201).json({
            success: true,
            token,
            user: safeUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// Login
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user._id);

        const safeUser = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            education: user.education,
            experience: user.experience,
            preferredRole: user.preferredRole,
            preferredLocation: user.preferredLocation,
            skills: user.skills
        };

        res.status(200).json({
            success: true,
            token,
            user: safeUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};