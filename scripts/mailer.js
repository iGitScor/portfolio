var mailer = require("mailer");

/***************************************************** 
 ***                     Mailer
 *****************************************************/
exports.sendMail = function(options) {
    if (options !== null && options.type !== null && options.name !== null && options.message !== null) {
        mailer.send({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            to: process.env.SMTP_ACCOUNT,
            from: process.env.SMTP_SENDER,
            subject: "Contact form",
            template: "./views/emails/" + options.type + ".html",
            data: {
                "message": options.message,
                "name": options.name
            },
            authentication: "login",
            username: process.env.SMTP_ACCOUNT,
            password: process.env.SMTP_PASSWORD
        }, function(error, result) {
            if (error) {
                // console.log(error);
            }
        });
    }
};