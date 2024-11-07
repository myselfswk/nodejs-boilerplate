import mongoose from 'mongoose';
const { connect } = mongoose;

import { logger } from '../utils/logger.js';
import { DATABASE, MONGO_URI } from '../utils/constants.js';

export default async () => {
  const { SUCCESS, FAIL } = DATABASE;

  try {
    await connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000 });
    console.log(SUCCESS);
  } catch (error) {
    logger.error(error.message);
    console.log(FAIL, error);
  }
}