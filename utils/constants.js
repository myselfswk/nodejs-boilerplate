// Email Exceptions
exports.EMAIL_EXCEPTIONS = {
    EMAIL_ALREADY_IN_USE: "Email already in use",
    INVALID_EMAIL: "Invalid email format",
    VERIFY_EMAIL: "An Email Send to Your Account, Please Verify",
    VERIFIED_SUCCESS: "Email Verified Successfully",
    EMAIL_DOESNOT_EXIST: "User with this email doesn't Exist"
}

// Images
exports.IMAGES = {
    DEFAULT_IMAGE: `${process.env.BACKEND_URL}uploads/icon.jpg`,
    IMAGE_URL: `${process.env.BACKEND_URL}uploads/`
}

// Database constants
exports.DATABASE = Object.freeze({
    SUCCESS: "Connected to Database Successfully",
    FAIL: "Could not Connected to DB..."
});

// While Empty Fields
exports.FIELDS = Object.freeze({
    FILL_ALL_FIELDS: "Please fill all the fields"
})

// Enum For roles
exports.ROLES = Object.freeze({
    USER: "user",
    ADMIN: "admin",
});

// Genders 
exports.GENDERS = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHERS: "others"
});

// Admin Fields for registering data
exports.ADMIN_FIELDS = Object.freeze({
    NAME: "Admin",
    EMAIL: "admin@admin.com",
    GENDER: this.GENDERS.MALE,
    ROLE: this.ROLES.ADMIN,
    PASSWORD: "Admin@#123",
    VERIFIED: true
});

// Status codes
exports.STATUS_CODES = Object.freeze({
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
});

// All API Constants
// Auth API constants
exports.AUTH_API_CONSTANTS = Object.freeze({
    AUTH: "/auth",
    AUTH_REGISTER: "/register",
    AUTH_VERIFY_USER: "/:id/verify/:token/",
    AUTH_lOGIN: "/login",
    CONNECT_WITH_GOOGLE: "/connectwithgoogle",
    CONNECT_WITH_APPLE: "/connectwithapple",
    CONNECT_WITH_FACEBOOK: "/connectwithfacebook"
});