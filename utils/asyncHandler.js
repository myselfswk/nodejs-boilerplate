import { errorHandling } from './errorHandling.js';

export const asyncHandler = ((fn) => (req, res) => {
    Promise.resolve(fn(req, res)).catch((err) => {
        errorHandling(err, res, req);
    });
});