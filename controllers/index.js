const { registerUser, verifyEmail, loginUser, connectWithApple, connectWithGoogle, connectWithFacebook } = require('./authControllers');

// All Auth Controllers
exports.authControllers = {
    registerUser,
    verifyEmail,
    loginUser,
    connectWithApple,
    connectWithGoogle,
    connectWithFacebook
}