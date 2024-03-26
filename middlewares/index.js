const { authenticateToken, isAdmin } = require('./authenticateToken');
const { isValidObjectId } = require('./isValidObjectId');

exports.middleWares = {
    authenticateToken,
    isAdmin,
    isValidObjectId
}