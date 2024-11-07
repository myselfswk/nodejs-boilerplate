import mongoose from 'mongoose';

import { sendResponse } from '../utils/sendResponse.js';
import { STATUS_CODES } from '../utils/constants.js';
const { BAD_REQUEST } = STATUS_CODES;

export const isValidObjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(BAD_REQUEST).send(sendResponse(false, "Invalid ID"));
    }
    next();
}