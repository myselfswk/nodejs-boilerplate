import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as dotenv from 'dotenv';
dotenv.config();

import { HOST, SERVICE, EMAIL_PORT, SECURE, USER, PASS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

const transport = nodemailer.createTransport({
    host: process.env.HOST || HOST,
    service: process.env.SERVICE || SERVICE,
    port: Number(process.env.EMAIL_PORT) || EMAIL_PORT,
    secure: Boolean(process.env.SECURE) || SECURE,
    tls: {
        rejectUnAuthorized: true
    },
    auth: {
        user: process.env.USER || USER,
        pass: process.env.PASS || PASS
    },
});

export const sendEmail = (receiver, subject, content, destination) => {
    try {
        ejs.renderFile(destination, { receiver, content }, (err, data) => {
            if (err) {
                console.log(err.message);
            } else {
                var mailOptions = {
                    from: `Living Legacy ${process.env.USER || USER}`,
                    to: receiver,
                    subject: subject,
                    html: data
                };

                transport.sendMail(mailOptions, (error, info) => {
                    if (error) return console.log(error.message);

                    console.log('Message sent: %s', info.messageId);
                });
            }
        });
    } catch (error) {
        logger.error(error.message);
        return error.message;
    }
}