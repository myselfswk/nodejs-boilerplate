import jwt from 'jsonwebtoken';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url'; // Import this for __dirname workaround

import User from '../models/user.model.js';
import ValidateToken from '../models/ValidateToken.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../services/sendEmail.service.js';
import { sendResponse } from '../utils/sendResponse.js';
import { isEmpty } from '../utils/isEmpty.js';

import { STATUS_CODES, FIELDS, BASE_URL, JWT_SECRET_KEY } from '../utils/constants.js';
const { BAD_REQUEST, SUCCESS, CREATED, CONFLICT } = STATUS_CODES;
const { FILL_ALL_FIELDS } = FIELDS;

// Register User Controller
export const registerUser = asyncHandler(async (req, res) => {
    // check if any value in body is empty
    if (!isEmpty(req.body)) return res.status(BAD_REQUEST).send(sendResponse(false, FILL_ALL_FIELDS));
    const { email, password, confirmPassword } = req.body;

    if (await User.isEmailValid(email)) return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid email format"));

    if (await User.isEmailTaken(email)) {
        if (await User.isEmailDeleted(email)) {
            return res.status(CONFLICT).send(sendResponse(false, "User Already Exist"));
        }
        return res.status(CONFLICT).send(sendResponse(false, "User Already Exist"));
    }

    // Validate password
    if (await User.isPasswordValid(password)) {
        if (password.length < 8) {
            return res.status(BAD_REQUEST).send(sendResponse(false, "Password Length Must be 8 or more"));
        }
        return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid password format"));
    }

    if (password !== confirmPassword) return res.status(BAD_REQUEST).send(sendResponse(false, "Password Does't Match with Confirm Password"));

    const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
    const hashPassword = await bcrypt.hash(password, salt);

    let user = await User.create({ ...req.body, password: hashPassword });
    const token = user.generateAuthToken();

    // Base Url
    const base = process.env.BASE_URL || BASE_URL;
    const url = `${base}users/${user.id}/verify/${token}`;
    const data = { url: url, name: req.body.fullname };

    // Workaround for __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const targetDir = "/views/verify-email.ejs";
    const destination = path.join(__dirname, "../", targetDir);

    //Now send email to verify
    await sendEmail(user.email, "Verify your Email Address", data, destination);
    res.status(SUCCESS).send(sendResponse(true, "An Email Send to Your Account, Please Verify"));
});

// Email Verify Controller
export const verifyEmail = asyncHandler(async (req, res) => {
    const { id, token } = req.params;
    //Check if link is valid
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid Link"));

    if (user?.verified) {
        res.status(SUCCESS).send(sendResponse(true, "User Already Verified"));
    } else {
        //check if the token is valid or not (decode returns the data of the user)
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        if (!decoded) return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid Link"));

        await User.updateOne({ _id: user._id }, { verified: true });
        res.status(SUCCESS).send(sendResponse(true, "Email Verified Successfully"));
    }
});

// Login User Controller
export const loginUser = asyncHandler(async (req, res) => {
    if (!isEmpty(req.body)) return res.status(BAD_REQUEST).send(sendResponse(false, FILL_ALL_FIELDS));
    const { email, password, fcmToken } = req.body;

    if (await User.isEmailValid(email)) return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid email format"));

    let user = await User.findOne({ email: email }).select("+password");

    if (!user) return res.status(BAD_REQUEST).send(sendResponse(false, "No User Found"));
    if (user?.isDeleted) return res.status(BAD_REQUEST).send(sendResponse(false, "User with this email doesn't Exist"));
    if (!(await user.isPasswordMatch(password))) return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid Password"));

    let token = user.generateAuthToken();
    if (!user.isverified) {
        const base = process.env.BASE_URL || BASE_URL;
        const url = `${base}users/${user.id}/verify/${token}`;
        const data = { url: url, name: user.fullname };

        // Workaround for __dirname in ES modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const targetDir = "/views/verify-email.ejs";
        const destination = path.join(__dirname, "../", targetDir);

        await sendEmail(user.email, "Verify your Email Address", data, destination);
        return res.status(SUCCESS).send(sendResponse(false, "Your Account is not verified, An Email Send to Your Account, Please Verify & Try Again"));
    }

    user = await User.findById(user.id);
    if (fcmToken) { user = await User.findByIdAndUpdate(user.id, { fcmToken: fcmToken }, { new: true }) }
    let results = { user: user, token: token };

    res.status(SUCCESS).send(sendResponse(true, "logged in successfully", results));
});

// Logout User Controller
export const logout = asyncHandler(async (req, res) => {
    let newUserForToken = await ValidateToken.findOne({ userId: req.user.id });
    if (newUserForToken) {
        let UserInTokenModel = await ValidateToken.findOne({ userId: req.user.id, token: { $in: req.headers.authorization.split(" ")[1] } });
        if (UserInTokenModel) {
            return res.status(SUCCESS).send(sendResponse(true, "User Already Logged Out"));
        } else {
            await ValidateToken.findOneAndUpdate({ userId: req.user.id }, { $push: { token: req.headers.authorization.split(" ")[1] } }, { new: true });
            await User.findByIdAndUpdate(req.user.id, { fcmToken: '' }, { new: true });
        }
    } else {
        await ValidateToken.create({ userId: req.user.id, token: req.headers.authorization.split(" ")[1] });
    }

    res.status(SUCCESS).send(sendResponse(true, "logged out successfully"));
});

// Connect With Google (Sign Up & Sign In) Controller
export const connectWithGoogle = asyncHandler(async (req, res) => {
    // Google Sign Up And Sign In
    if (!isEmpty(req.body)) return res.status(BAD_REQUEST).send(sendResponse(false, FILL_ALL_FIELDS));

    const { displayName, email, photoURL, fcmToken } = req.body;
    let user = await User.findOne({ email: email });
    let data = {}, token;

    // If the user is deleted, and wanna register again
    if (user?.isDeleted) {
        user = await User.findByIdAndUpdate(user?.id, { isDeleted: false }, { new: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        return res.status(CREATED).send(sendResponse(true, "Register With Google, Welcome Back", data));
    }

    if (!user) {
        user = await User.create({ fullname: displayName, email: email, profile: photoURL, fcmToken: fcmToken, verified: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        res.status(CREATED).send(sendResponse(true, "Register With Google", data));
    } else {
        user = await User.findByIdAndUpdate(user?.id, { fcmToken: fcmToken }, { new: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        res.status(SUCCESS).send(sendResponse(true, "Login With Google", data));
    }
});

// Connect with apple (Sign up & sign in) Controller
export const connectWithApple = asyncHandler(async (req, res) => {
    // Apple Sign Up & Sign In
    if (!isEmpty(req.body)) return res.status(BAD_REQUEST).send(sendResponse(false, FILL_ALL_FIELDS));

    const { uid, displayName, email, photoURL, fcmToken } = req.body;
    let user = await User.findOne({ uid: uid });
    let data = {}, token;

    // If the user is deleted, and wanna register again
    if (user?.isDeleted) {
        user = await User.findByIdAndUpdate(user?.id, { isDeleted: false }, { new: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        return res.status(CREATED).send(sendResponse(true, "Register With Apple, Welcome Back", data));
    }

    if (!user) {
        user = await User.create({
            uid: uid, email: email,
            fullname: displayName === "null" || null ? 'Apple User' : displayName, verified: true,
            profile: photoURL === "null" || null ? 'uploads/icon.jpg' : photoURL, fcmToken: fcmToken
        });
        token = user.generateAuthToken();

        data = { user: user, token: token }
        res.status(CREATED).send(sendResponse(true, "Register With Apple", data));
    } else {
        user = await User.findByIdAndUpdate(user?.id, { fcmToken: fcmToken }, { new: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        res.status(SUCCESS).send(sendResponse(true, "Login With Apple", data));
    }
});

// Connect with Facebook (Sign up & sign in) Controller
export const connectWithFacebook = asyncHandler(async (req, res) => {
    if (!isEmpty(req.body)) return res.status(BAD_REQUEST).send(sendResponse(false, FILL_ALL_FIELDS));
    const { facebookId, displayName, email, photoURL, fcmToken } = req.body;
    let user = await User.findOne({ facebookId: facebookId });
    let data = {}, token;

    // If the user is deleted, and wanna register again
    if (user?.isDeleted) {
        user = await User.findByIdAndUpdate(user?.id, { isDeleted: false }, { new: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        return res.status(CREATED).send(sendResponse(true, "Register With Facebook, Welcome Back", data));
    }

    // Create a user if does not exist
    if (!user) {
        user = await User.create({ facebookId: facebookId, fullname: displayName, email: email, profile: photoURL, fcmToken: fcmToken, verified: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        res.status(CREATED).send(sendResponse(true, "Register With Facebook", data));
    } else {
        user = await User.findByIdAndUpdate(user?.id, { fcmToken: fcmToken }, { new: true });
        token = user.generateAuthToken();
        data = { user: user, token: token }

        res.status(SUCCESS).send(sendResponse(true, "Login With Facebook", data));
    }
});