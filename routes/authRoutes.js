const router = require("express").Router();

const { authControllers } = require("../controllers");
const { AUTH_API_CONSTANTS } = require("../utils/constants");

// Resgiter User Route
router.post(AUTH_API_CONSTANTS.AUTH_REGISTER, authControllers.registerUser);

// Email Verify route
router.get(AUTH_API_CONSTANTS.AUTH_VERIFY_USER, authControllers.verifyEmail);

// Login User Route
router.post(AUTH_API_CONSTANTS.AUTH_lOGIN, authControllers.loginUser);

module.exports = router;