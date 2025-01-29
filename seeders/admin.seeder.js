import User from '../models/user.model.js';
import { ADMIN_FIELDS } from '../utils/constants.js';
const { FULLNAME, USERNAME, ISVERIFIED, EMAIL, PASSWORD, ROLE } = ADMIN_FIELDS;

export const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: EMAIL }).select("+password");

        if (!existingAdmin) {
            // Create admin credentials
            const adminCredentials = {
                fullname: FULLNAME,
                username: USERNAME,
                email: EMAIL,
                password: await User.hashPassword(PASSWORD),
                isverified: ISVERIFIED,
                role: ROLE
            }

            // Create admin user
            await User.create(adminCredentials);
            console.log("Admin created successfully");
        }

    } catch (error) {
        console.log(error.message);
    }
}