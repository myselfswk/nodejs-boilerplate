const { ADMIN_FIELDS } = require('../utils/constants');
const { User } = require("../models/user");
const { logger } = require('../utils/logger');

exports.seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_FIELDS.EMAIL }).select("+password");

        if (!existingAdmin) {
            // Create admin credentials
            const adminCredentials = {
                name: ADMIN_FIELDS.NAME,
                email: ADMIN_FIELDS.EMAIL,
                gender: ADMIN_FIELDS.GENDER,
                role: ADMIN_FIELDS.ROLE,
                email: ADMIN_FIELDS.EMAIL,
                password: await User.hashPassword(ADMIN_FIELDS.PASSWORD),
                verified: ADMIN_FIELDS.VERIFIED
            }

            // Create admin user
            await User.create(adminCredentials);

            console.info("Admin created successfully");
        }

    } catch (error) {
        logger.error(error.message);
        console.error(error.message);
    }
}