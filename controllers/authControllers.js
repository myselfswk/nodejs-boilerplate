const path = require("path");
const { } = require("crypto");

const { User } = require("../models/user")
const { sendResponse } = require("../utils/sendResponse");
const { STATUS_CODES, FIELDS, EMAIL_EXCEPTIONS } = require("../utils/constants");
const { isEmpty } = require("../utils/isEmpty");
const { errorHandling } = require("../utils/errorHandling");
const { SendEmail } = require("../services/sendEmail");

// Register User Controller
exports.registerUser = async (req, res) => {
  try {
    // check if any value in body is empty
    if (!isEmpty(req.body)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, FIELDS.FILL_ALL_FIELDS));
    const { email, password, confirmPassword } = req.body;

    if (await User.isEmailValid(email)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, EMAIL_EXCEPTIONS.INVALID_EMAIL));

    if (await User.isEmailTaken(email)) {
      if (await User.isEmailDeleted(email)) {
        return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "User Already Exist"));
      }
      return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "User Already Exist"));
    }

    // Validate password
    if (await User.isPasswordValid(password)) {
      if (password.length < 8) {
        return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Password Length Must be 8 or more"));
      }
      return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Invalid password format"));
    }

    if (password !== confirmPassword) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Password Does't Match with Confirm Password"));

    let user = await User.create({ ...req.body, password: await User.hashPassword(password) });
    const token = user.generateAuthToken();

    // Base Url
    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token}`;
    const data = { url: url, name: req.body.fullname };

    const targetDir = "/views/verify-email.ejs";
    const destination = path.join(__dirname, "../", targetDir);

    //Now send email to verify
    await SendEmail(user.email, "Verify your Email Address", data, destination);

    res.status(STATUS_CODES.SUCCESS).send(sendResponse(true, EMAIL_EXCEPTIONS.VERIFY_EMAIL));

  } catch (error) {
    errorHandling(error, res);
  }
}
// Email Verify Controller
exports.verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;
    //Check if link is valid
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Invalid Link"));

    if (user.verified) {
      res.send(sendResponse(false, "User Already Verified"));
    } else {
      //check if the token is valid or not (decode returns the data of the user)
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

      if (!decoded)
        return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Invalid Link"));

      await User.updateOne({ _id: user._id }, { verified: true });
      res.status(STATUS_CODES.SUCCESS).send(sendResponse(true, EMAIL_EXCEPTIONS.VERIFIED_SUCCESS));
    }
  } catch (error) {
    errorHandling(error, res);
  }
}

// Login User Controller
exports.loginUser = async (req, res) => {
  //when we passed funtion in a parameter, its callback funtion
  try {
    if (!isEmpty(req.body)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, FIELDS.FILL_ALL_FIELDS));
    const { email, password } = req.body;

    if (await User.isEmailValid(email)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, EMAIL_EXCEPTIONS.INVALID_EMAIL));
    let user = await User.findOne({ email: email }).select("+password");

    if (!user || user.isDeleted) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, EMAIL_EXCEPTIONS.EMAIL_DOESNOT_EXIST));
    if (!user || !(await user.isPasswordMatch(password))) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Invalid Password"));

    let token;
    if (!user.verified) {
      token = user.generateAuthToken();

      const url = `${process.env.BASE_URL}users/${user.id}/verify/${token}`;
      const data = { url: url, name: user.fullname };

      const targetDir = "/views/verify-email.ejs";
      const destination = path.join(__dirname, "../", targetDir);

      await SendEmail(user.email, "Verify your Email Address", data, destination);
      return res.status(STATUS_CODES.SUCCESS).send(sendResponse(false, "Your Account is not verified, An Email Send to Your Account, Please Verify & Try Again"));
    }

    token = user.generateAuthToken();
    user = await User.findByIdAndUpdate(user.id, { refreshToken: token }, { new: true }).select('-password');

    res.status(STATUS_CODES.SUCCESS).send(sendResponse(true, "logged in successfully", user));

  } catch (error) {
    errorHandling(error, res);
  }
}

// Connect With Google (Sign Up & Sign In) Controller
exports.connectWithGoogle = async (req, res) => {
  try {
    // Google Sign Up And Sign In
    if (!isEmpty(req.body)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, FIELDS.FILL_ALL_FIELDS));

    const { displayName, email, photoURL } = req.body;
    let user = await User.findOne({ email: email });
    let data = {}, token;

    if (!user) {
      user = await User.create({ fullname: displayName, email: email, profile: photoURL, verified: true });
      token = user.generateAuthToken();
      data = { user: user, token: token }

      res.status(STATUS_CODES.CREATED).send(sendResponse(true, "Register With Google", data));
    } else {
      //get user Details
      token = user.generateAuthToken();
      data = { user: user, token: token }

      res.status(STATUS_CODES.SUCCESS).send(sendResponse(true, "Login With Google", data));
    }
  } catch (error) {
    errorHandling(error, res);
  }
}

// Connect with apple (Sign up & sign in) Controller
exports.connectWithApple = async (req, res) => {
  try {
    // Apple Sign Up & Sign In
    if (!isEmpty(req.body)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, FIELDS.FILL_ALL_FIELDS));

    const { uid, displayName, email, photoURL } = req.body;
    let user = await User.findOne({ uid: uid });
    let data = {}, token;

    if (!user) {
      user = await User.create({ uid: uid, fullname: displayName, email: email, profile: photoURL, verified: true });
      token = user.generateAuthToken();

      data = { user: user, token: token }
      res.status(STATUS_CODES.CREATED).send(sendResponse(true, "Register With Apple", data));
    } else {
      //get user Details
      token = user.generateAuthToken();
      data = { user: user, token: token }

      res.status(STATUS_CODES.SUCCESS).send(sendResponse(true, "Login With Apple", data));
    }

  } catch (error) {
    errorHandling(error, res);
  }
}

// Connect with Facebook (Sign up & sign in) Controller
exports.connectWithFacebook = async (req, res) => {
  try {
    if (!isEmpty(req.body)) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, FIELDS.FILL_ALL_FIELDS));
    const { facebookId, displayName, email, photoURL } = req.body;
    let user = await User.findOne({ facebookId: facebookId });
    let data = {}, token;

    // Create a user if does not exist
    if (!user) {
      user = await User.create({ facebookId: facebookId, fullname: displayName, email: email, profile: photoURL, verified: true });
      token = user.generateAuthToken();
      data = { user: user, token: token }

      res.status(STATUS_CODES.CREATED).send(sendResponse(true, "Register With Facebook", data));
    } else {
      token = user.generateAuthToken();
      data = { user: user, token: token }

      res.status(STATUS_CODES.SUCCESS).send(sendResponse(true, "Login With Facebook", data));
    }
  } catch (error) {
    errorHandling(error, res);
  }
}