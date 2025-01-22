import { sendResponse } from "../utils/sendResponse.js";
import { STATUS_CODES } from "../utils/constants.js";
const { TOO_MANY_REQUEST } = STATUS_CODES;
const rateLimitMap = new Map();

export const ipLimiter = (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const windowTime = 15 * 60 * 1000; // 15 minutes
    const requestLimit = 100;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const requestTimestamps = rateLimitMap.get(ip);
    // Remove timestamps older than the window
    const updatedTimestamps = requestTimestamps.filter((timestamp) => currentTime - timestamp < windowTime);

    if (updatedTimestamps.length >= requestLimit) {
        res.status(TOO_MANY_REQUEST).send(sendResponse(false, "Too many requests, please try again later."));
    } else {
        updatedTimestamps.push(currentTime);
        rateLimitMap.set(ip, updatedTimestamps);
        next();
    }
}