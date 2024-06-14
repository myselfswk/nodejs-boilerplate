const { errorHandling } = require('../utils/errorHandling');

exports.asyncHandler = ((fn) => (req, res) => {
    Promise.resolve(fn(req, res)).catch((err) => {
        errorHandling(err, res);
    });
});