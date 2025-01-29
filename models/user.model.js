import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import { ROLES, JWT_SECRET_KEY, JWT_EXPIRATION } from '../utils/constants.js';
const { USER } = ROLES;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: false,
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
    profile: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: false,
        trim: true,
        select: false,
        min: 8,
        max: 16
    },
    role:{
        type: String,
        default: USER,
        enum: Object.values(ROLES)
    },
    isverified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// return json web token for specific user
userSchema.methods.generateAuthToken = function () {
    const private_key = process.env.JWTPRIVATEKEY || JWT_SECRET_KEY;
    const JWT_EXPIRATION_SECRET = process.env.JWT_EXPIRATION || JWT_EXPIRATION;
    const token = jwt.sign({ _id: this._id, }, private_key, { expiresIn: JWT_EXPIRATION_SECRET });
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
    if (email) {
        return !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
}

// check if Password template is Valid
userSchema.statics.isPasswordValid = async function (password) {
    if (password) {
        return !password.match(/^(?=.*[A-Z])(?=.*[@#$!%*?&])(?=.{8,})/);
    }
}

// check if Email template is Valid
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export default model('user', userSchema);