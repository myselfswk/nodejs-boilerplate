const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY);

exports.sendNotification = (registrationToken, title, body) => {
    try {
        const message = {
            to: registrationToken,
            notification: {
                title: title,
                body: body
            }
        };

        fcm.send(message, (err, response) => {
            if (err) {
                console.log("Something has gone wrong!", err);
                return err;
            } else {
                console.log("Successfully sent with response: ", response);
                return response;
            }
        });
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}

exports.sendNotificationMultiple = (tokens, title, body) => {
    tokens?.forEach(token => {
        this.sendNotification(token, title, body)
    });
}