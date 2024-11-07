import User from '../models/user.model.js';
import { ADMIN_FIELDS } from '../utils/constants.js';
const { FULLNAME, DATEOFBIRTH, COUNTRY, EMAIL, PASSWORD, PHONENUMBER, VERIFIED, ROLE } = ADMIN_FIELDS;

export const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: EMAIL }).select("+password");

        if (!existingAdmin) {
            // Create admin credentials
            const adminCredentials = {
                fullname: FULLNAME,
                dateofbirth: DATEOFBIRTH,
                country: COUNTRY,
                email: EMAIL,
                phoneNumber: PHONENUMBER,
                password: await User.hashPassword(PASSWORD),
                verified: VERIFIED,
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