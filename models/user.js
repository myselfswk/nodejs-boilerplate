const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ROLES, GENDERS, IMAGES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        sparse: true,
        set: (e) => e.toLowerCase(),
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: false,
        select: false,
        trim: true
    },
    profile: {
        type: String,
        default: IMAGES.DEFAULT_IMAGE
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(GENDERS)
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: ROLES.USER,
        enum: Object.values(ROLES)
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// return json web token for specific user
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, }, process.env.JWTPRIVATEKEY, { expiresIn: process.env.JWT_EXPIRATION });
    return token;
}

// Check if email us already taken or not
userSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
}

// check if password is match with database
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

// check if Email is Deleted
userSchema.statics.isEmailDeleted = async function (email) {
    const user = await this.findOne({ email: email });
    if (user.isDeleted) return !user;
}

// check if Email template is Valid
userSchema.statics.isEmailValid = async function (email) {
    return !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

// check if Password template is Valid
userSchema.statics.isPasswordValid = async function (password) {
    return !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[a-zA-Z\d@#$!%*?&]{8,}$/);
}

// check if Email template is Valid
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

exports.User = mongoose.model("user", userSchema);