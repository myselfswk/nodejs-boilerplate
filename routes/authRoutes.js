const router = require("express").Router();

const { authControllers } = require("../controllers");
const { AUTH_API_CONSTANTS } = require("../utils/constants");

// Resgiter User Route
router.post(AUTH_API_CONSTANTS.AUTH_REGISTER, authControllers.registerUser);

// Email Verify route
router.get(AUTH_API_CONSTANTS.AUTH_VERIFY_USER, authControllers.verifyEmail);

// Login User Route
router.post(AUTH_API_CONSTANTS.AUTH_lOGIN, authControllers.loginUser);

// Connect With Google (Sign Up & Sign In) Route
router.post(AUTH_API_CONSTANTS.CONNECT_WITH_GOOGLE, authControllers.connectWithGoogle);

// Connect With Apple (Sign Up & Sign In) Route
router.post(AUTH_API_CONSTANTS.CONNECT_WITH_APPLE, authControllers.connectWithApple);

// Connect With Facebook (Sign Up & Sign In) Route
router.post(AUTH_API_CONSTANTS.CONNECT_WITH_FACEBOOK, authControllers.connectWithFacebook);

module.exports = router;