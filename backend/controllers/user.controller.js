const User = require('../models/user.models.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/dataUri.js');
const { cloudinary } = require('../utils/cloudinary.js');

const register = async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;

        // Validate fields
        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format', success: false });
        }

        // Password strength check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
                success: false,
            });
        }

        // Check for existing user
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const newUser = new User({
            fname,
            lname,
            email,
            password: hashedPassword, // 🔐 hashed password
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false, error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errMsg = 'Authentication failed. Please check your credentials and try again.';

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: errMsg, success: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: errMsg, success: false });
        }

        if (!process.env.SECRET_KEY) {
            return res.status(500).json({ message: 'Internal server error: SECRET_KEY not set', success: false });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        )
        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            httpOnly: true,              // so JS on frontend can't access it (secure)
            sameSite: "lax",             // 'lax' is good for most cases, allows sending cookie on navigation
            // secure: false                // false for local dev (http), true for production (https)
        }).json({
            success: true,
            message: `Welcome back ${user.fname}`,
            user
        });

        // Set cookie
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     sameSite: 'strict',
        //     maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
        // });

        // Send response
        // return res.status(200).json({
        //     message: `Welcome back ${user.fname}`,
        //     token,
        //     success: true,
        //     user
        // });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false, error: err.message });
    }
};


const logOut = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'  // Optional: Secure in production
        });

        return res.status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            message: "Internal server error during logout",
            success: false
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fname, lname, bio, occupation, facebook, instagram, linkedin, github } = req.body;
        const file = req.file;

        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                success: false
            });
        }

        // Update the profile
        if (fname) user.fname = fname;
        if (lname) user.lname = lname;
        if (facebook) user.facebook = facebook;
        if (linkedin) user.linkedin = linkedin;
        if (instagram) user.instagram = instagram;
        if (github) user.github = github;
        if (bio) user.bio = bio;
        if (occupation) user.occupation = occupation;
        if (file && cloudResponse) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile Updated Successfully",
            success: true,
            user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message || 'Internal server error',
            success: false
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // exclude password field
        res.status(200).json({
            success: true,
            message: "User list fetched successfully",
            total: users.length,
            users
        });
    } catch (error) {
        console.error("Error fetching user list:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
}

// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find()
//             .select('-password')
//             .populate({
//                 path: 'blogs',
//                 match: { isPublished: true },
//                 select: '_id title' // optionally include just blog title/id
//             });

//         const filteredUsers = users.filter(user => user.blogs?.length > 0);

//         res.status(200).json({
//             success: true,
//             message: "Filtered users fetched successfully",
//             total: filteredUsers.length,
//             users: filteredUsers
//         });
//     } catch (error) {
//         console.error("Error fetching filtered users:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch users"
//         });
//     }
// };





module.exports = { register, login, logOut, updateProfile, getAllUsers };
