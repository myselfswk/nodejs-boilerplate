const { registerUser, verifyEmail, loginUser } = require('./authControllers');

// All Auth Controllers
exports.authControllers = {
    registerUser,
    verifyEmail,
    loginUser
}