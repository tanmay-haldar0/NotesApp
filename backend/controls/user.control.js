import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const addUser   = async (req, res) => {
    const newUser   = req.body;

    if (!newUser  .name || !newUser  .email || !newUser  .password) {
        return res.status(400).json({ error: true, message: "Please fill in all fields" });
    }

    const isUser   = await User.findOne({ email: newUser  .email });

    if (isUser  ) {
        return res.json({
            error: true,
            message: "Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(newUser .password, 10);
    const user = new User({ ...newUser  , password: hashedPassword });

    await user.save();

    // Use 'user' key for the JWT payload
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m"
    });

    return res.json({
        error: false,
        token: accessToken,
        message: "Account created successfully"
    });
};

export const logIn = async (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).json({ error: true, message: "Please enter all fields" });
    };

    const userInfo = await User.findOne({ email: user.email });

    if (!userInfo) {
        return res.status(400).json({
            error: true, 
            message: "User  not found"
        });
    };

    const isPasswordValid = await bcrypt.compare(user.password, userInfo.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            error: true,
            message: "Invalid password"
        });
    }

    // Use 'user' key for the JWT payload
    const logInAccessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m"
    });

    return res.status(200).json({
        error: false,
        message: "Logged in successfully",
        token: logInAccessToken,
        email: user.email
    });
};

export const getUser   = async (req, res) => {
    try {
        // console.log('req.user:', req.user); // Log the req.user to see its structure

        if (!req.user || !req.user.user) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const userId = req.user.user._id; // Access the user ID directly

        // console.log('User  ID:', userId); // Log the user ID

        const user = await User.findById(userId).select('-password -__v').lean();

        if (!user) {
            return res.status(404).json({ error: true, message: "User  not found" });
        }

        return res.json({
            error: false,
            message: "User  found",
            user // Send the user object
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};