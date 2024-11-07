// App Level Contants (environment Variables)
export const HOST = "smtp.gmail.com";
export const SERVICE = "gmail";
export const EMAIL_PORT = 587;
export const SECURE = false;
export const USER = "appteam023@gmail.com";
export const PASS = "eutzdyvezfyemsjv";
export const MAX_PAGE_LENGTH = 2260;
export const IV_LENGTH = 16;
export const JWT_SECRET_KEY = 'my secret key';
export const JWT_EXPIRATION = "7d";
export const ENCRYPTION_KEY = 'XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT';

export const BASE_URL = 'https://flutterapi.testdevlink.net/esmeralda/';
export const BACKEND_URL = 'http://livinglegacy.testdevlink.net/';
export const MONGO_URI = "mongodb+srv://appteam:appteam023@cluster0.3pcyibq.mongodb.net/esmeralda";
export const FCM_SERVER_KEY = "AAAAPgg9y80:APA91bH37QZnLwjiU4EiLaJAturIb6EZtZpbGtt-9pn2UhqBLLqGkw9jzgMPlnIQEXUPGIajF0SO1PDz8c5ZRgsmMnGlnRFiPJUNFH8PUSwMbmwcPuJ8FZhP6LidEIoP8DE5h971UPCe";

// While Empty Fields
export const FIELDS = Object.freeze({
    FILL_ALL_FIELDS: "Please fill all the fields"
});

// Enum For roles
export const ROLES = Object.freeze({
    USER: "user",
    ADMIN: "admin",
    SUPER_ADMIN: "superAdmin"
});

// Admin Fields for registering data
export const ADMIN_FIELDS = Object.freeze({
    FULLNAME: "Admin",
    DATEOFBIRTH: "1999-04-10T14:43:16.817+00:00",
    COUNTRY: "NYC, USA",
    EMAIL: "admin@admin.com",
    PHONENUMBER: 123456789,
    PASSWORD: "Admin@#123",
    VERIFIED: true,
    ROLE: ROLES.SUPER_ADMIN
});

// Database constants
export const DATABASE = Object.freeze({
    SUCCESS: "Connected to Database Successfully",
    FAIL: "Could not Connected to DB..."
});

// Status codes
export const STATUS_CODES = Object.freeze({
    // Informational
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    // Success
    SUCCESS: 200,
    CREATED: 201,
    // Redirection
    MOVED_PERMANENTLY: 301,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
});

// Images
export const IMAGES = {
    DEFAULT_IMAGE: `${process.env.BACKEND_URL || BACKEND_URL}/uploads/user/icon.jpg`,
    IMAGE_URL: `${process.env.BACKEND_URL || BACKEND_URL}/uploads/`,
    IMAGE_PATH: 'uploads/user/icon.jpg',
    COVER_IMAGE_PATH: 'uploads/cover/coverIcon.jpg'
}

// All API Constants
// Auth API constants (For Both Admin And User)
export const AUTH_API_CONSTANTS = Object.freeze({
    AUTH: "/auth",
    ADMIN: "/admin",
    USER: "/user",
    AUTH_REGISTER: "/register",
    AUTH_VERIFY: "/:id/verify/:token/",
    AUTH_lOGIN: "/login",
    AUTH_LOGOUT: "/logout",
    CONNECT_WITH_GOOGLE: "/connectwithgoogle",
    CONNECT_WITH_APPLE: "/connectwithapple",
    CONNECT_WITH_FACEBOOK: "/connectwithfacebook"
});

// User & Admin API Constants
export const FLOW_API_CONSTANTS = Object.freeze({
    ALL_ADMIN: "/",
    ALL_USER: "/",
    FORGET_PASSWORD: "/forgetpassword",
    VERIFY_CODE: "/verifycode",
    VIEW_USER_PROFILE: "/viewprofile",
    UPDATE_PROFILE: "/updateprofile",
    CONFIRM_PASSWORD: "/confirmpassword",
    CHANGE_PASSWORD: "/changepassword",
    DELETE_USER: "/deleteuser",
    REFRESH_TOKEN: '/refreshtoken',
    REPORT: '/report',
    REPORT_USER: '/reportuser',
    SEARCH_USER: '/searchuser',
    SEARCH_USER_FOR_TAGS: '/searchuserfortags',
    ALL_REPORTS: '/allreports',
    REPORT_DETAILS_BY_ID: '/reportdetailsbyid',
    GET_ALL_MESSAGES: '/getallmessages',
    FOLLOW_USER: '/followuser',
    GET_ALL_USERS: '/getallusers',
    GET_USER_BY_ID: '/getuserbyid'
});

export const ADMIN_API_CONSTANTS = Object.freeze({
    VIEW_ALL_ADMIN: '/viewalladmin',
    VIEW_PROFILE: '/viewprofile'
});

// notifications API constants
export const NOTIFICATIONS_API_CONSTANTS = Object.freeze({
    NOTIFICATIONS: '/notification',
    GET_ALL_NOTIFICATIONS: '/getallnotifications',
    GET_NOTIFICATION_BY_ID: '/getnotificationbyid',
    MARK_AS_READ: '/markasread',
    SEND_NOTIFICATION_TO_USER: '/sendnotificationtouser',
    GET_ALL_NOTIFICATIONS_FOR_ADMIN: '/getallnotificationsforadmin',
    GET_NOTIFICATION_FOR_ADMIN_BY_ID: '/getadminnotificationbyid'
});

// Dashboard api constants
export const DASHBOARD_API_CONSTANTS = Object.freeze({
    DASHBOARD: '/dashboard',
});

// Notification Redirect constant
export const NOTIF_REDIRECT = Object.freeze({
    HOME: 'home'
});

// find data from pagination constants
export const PAGINATION_CONSTANTS = Object.freeze({
    FIND: 'find',
    FIND_BY_ID: 'findById',
    FIND_ONE: 'findOne'
});