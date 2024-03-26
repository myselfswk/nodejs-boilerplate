const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { sendResponse } = require('../utils/sendResponse');
const { ROLES, STATUS_CODES } = require('../utils/constants');

// Token Function
exports.authenticateToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decode token id
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
            // return user without password
            const user = await User.findById({ _id: decoded._id }).select("-password");
            if (!user) return res.status(STATUS_CODES.NOT_FOUND).send(sendResponse(false, "User not found"));

            req.user = user
            next();

        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(sendResponse(false, "Not Authorize, Token Failed"));
        }
    }

    if (!token) {
        res.status(STATUS_CODES.NOT_FOUND).send(sendResponse(false, "Not Authorize, No Token"));
    }
}

// auth Admin
// token middleware that make sure to show anything for admin
exports.isAdmin = async (req, res, next) => {
    if (req.user.role !== ROLES.ADMIN) {
        return res.status(STATUS_CODES.FORBIDDEN).send(sendResponse(false, "Access denied. Admin role required."));
    }
    next();
}