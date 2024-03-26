const mongoose = require("mongoose");
require("dotenv").config();

const { DATABASE } = require('../utils/constants');

module.exports = () => {
  mongoose.set("strictQuery", false);

  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log(DATABASE.SUCCESS);
  } catch (error) {
    console.log(DATABASE.FAIL, error);
  }
}