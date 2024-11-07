import { logger } from './logger.js';
import { sendResponse } from './sendResponse.js';

import { STATUS_CODES } from './constants.js';
const { INTERNAL_SERVER_ERROR } = STATUS_CODES;

export const errorHandling = (error, res, req) => {
    logger.error(error.message + " : " + req?.originalUrl);
    res.status(INTERNAL_SERVER_ERROR).send(sendResponse(false, error.message));
}