import { sendResponse } from './sendResponse.js';
import { STATUS_CODES } from './constants.js';

// Call if url is broken or invalid
export const endPoint = (req, res) => {
    const { NOT_FOUND } = STATUS_CODES;
    res.status(NOT_FOUND).send(sendResponse(false, "Endpoint does not exist.", req?.originalUrl));
}