const { authenticateToken, isAdmin } = require('./authenticateToken');
const { isValidObjectId } = require('./isValidObjectId');
const { asyncHandler } = require('./asyncHandler');

exports.middleWares = {
    authenticateToken,
    isAdmin,
    isValidObjectId,
    asyncHandler
}