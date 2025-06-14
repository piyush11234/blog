const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: '',
    },
    occupation: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
    linkedin: {
        type: String,
        default: '',
    },
    github: {
        type: String,
        default: '',
    },
    facebook: {
        type: String,
        default: '',
    }
    // ✅ Add this field to reference Blog documents
    // blogs: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Blog'
    // }]


}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
