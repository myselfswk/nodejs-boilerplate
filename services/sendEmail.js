const nodemailer = require('nodemailer');
const ejs = require('ejs');

const transport = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
        user: process.env.USER ? process.env.USER : "appteam023@gmail.com",
        pass: process.env.PASS ? process.env.PASS : "eutzdyvezfyemsjv"
    },
});

exports.SendEmail = (receiver, subject, content, destination) => {
    try {
        ejs.renderFile(destination, { receiver, content }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                var mailOptions = {
                    from: `Elite Care ${process.env.USER ? process.env.USER : "appteam023@gmail.com"}`,
                    to: receiver,
                    subject: subject,
                    html: data
                };

                transport.sendMail(mailOptions, (error, info) => {
                    if (error) return console.log(error);

                    console.log('Message sent: %s', info.messageId);
                });
            }
        });
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}