const router = require('express').Router();

const authRoutes = require('./authRoutes');
const { AUTH_API_CONSTANTS } = require('../utils/constants');

// All Auth Routes
router.use(AUTH_API_CONSTANTS.AUTH, authRoutes);

module.exports = router;