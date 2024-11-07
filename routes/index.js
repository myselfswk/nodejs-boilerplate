import { Router } from 'express';
const router = Router();

import authRoutes from './auth.routes.js';

import { AUTH_API_CONSTANTS } from '../utils/constants.js';
const { AUTH } = AUTH_API_CONSTANTS;

// All User Routes
router.use(AUTH, authRoutes);

export default router;