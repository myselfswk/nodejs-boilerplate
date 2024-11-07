import { Router } from 'express';
const router = Router();

import { connectWithApple, connectWithFacebook, connectWithGoogle, loginUser, logout, registerUser, verifyEmail } from '../controllers/auth.controllers.js';
import { authenticateToken } from '../middlewares/index.js';

import { AUTH_API_CONSTANTS } from '../utils/constants.js';
const { AUTH_REGISTER, AUTH_VERIFY, AUTH_lOGIN, AUTH_LOGOUT, CONNECT_WITH_APPLE, CONNECT_WITH_FACEBOOK, CONNECT_WITH_GOOGLE } = AUTH_API_CONSTANTS;

// Resgiter User/player/admin Route
router.post(AUTH_REGISTER, registerUser);

// Email Verify route
router.get(AUTH_VERIFY, verifyEmail);

// Login User Route
router.post(AUTH_lOGIN, loginUser);

// Logout User Route
router.post(AUTH_LOGOUT, authenticateToken, logout);

// Connect With Google (Sign Up & Sign In) Route
router.post(CONNECT_WITH_GOOGLE, connectWithGoogle);

// Connect With Apple (Sign Up & Sign In) Route
router.post(CONNECT_WITH_APPLE, connectWithApple);

// Connect With Facebook (Sign Up & Sign In) Route
router.post(CONNECT_WITH_FACEBOOK, connectWithFacebook);

export default router;