import jwt from 'jsonwebtoken';

import ValidateToken from '../models/ValidateToken.model.js';
import User from '../models/user.model.js';
import { sendResponse } from '../utils/sendResponse.js';
import { errorHandling } from '../utils/errorHandling.js';

import { STATUS_CODES, ROLES, JWT_SECRET_KEY } from '../utils/constants.js';
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = STATUS_CODES;
const { ADMIN, SUPER_ADMIN } = ROLES;

// Token Function
export const authenticateToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const private_key = process.env.JWTPRIVATEKEY || JWT_SECRET_KEY;
            const decoded = jwt.verify(token, private_key);
            const user = await User.findById({ _id: decoded._id });
            if (!user) return res.status(NOT_FOUND).send(sendResponse(false, "User not found"));

            let UserInTokenModel = await ValidateToken.findOne({ user: user?._id, token: { $in: token } });
            if (UserInTokenModel) return res.status(UNAUTHORIZED).send(sendResponse(false, "Token Expired"));
            if (user && user?.isDeleted) return res.status(BAD_REQUEST).send(sendResponse(false, "Your Account has been deleted, Please Contact the administrator"));

            user.token = token;
            req.user = user;
            next();

        } catch (error) {
            errorHandling(error, res, req);
        }
    }

    if (!token) {
        res.status(BAD_REQUEST).send(sendResponse(false, "Not Authorize, No Token"));
    }
}

// auth Admin
// token middleware that make sure to show anything for admin
export const isAdmin = async (req, res, next) => {
    if (req.user.role !== ADMIN && req.user.role !== SUPER_ADMIN) {
        return res.status(FORBIDDEN).send(sendResponse(false, "Access denied. Admin role required."));
    }
    next();
}