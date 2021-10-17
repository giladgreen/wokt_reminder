const nodemailer = require('nodemailer');
const logger = require('./logger');
const { logs } = require('../models');

const from = 'info@walt-assist.com';
const ADMIN_MAIL = process.env.ADMIN_MAIL ? process.env.ADMIN_MAIL : require('../../local').ADMIN_MAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD : require('../../local').EMAIL_PASSWORD;

function sendHtmlMail(subject, html, to) {
    if (!ADMIN_MAIL || !EMAIL_PASSWORD) {
        logger.info('[Email-service] no email user/password, email will not be sent');
        return;
    }
    const mailOptions = {
        from,
        to,
        subject,
        html,
    };
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ADMIN_MAIL,
            pass: EMAIL_PASSWORD,
        },
    });
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            logger.error(`[Email-service] error sending email: [from: ${mailOptions.from}] [to: ${to}] [subject: ${subject}] - error: ${JSON.stringify(error)}`);
            logs.create({
                text: `error sending email. [from: ${mailOptions.from}] [to: ${to}] [subject: ${subject}]  error message: ${error.message}, error stack: ${error.stack}`,
                level: 'ERROR'
            });

        } else {
            logger.info(`[Email-service] email sent: [from: ${mailOptions.from}] [to: ${to}] [subject: ${subject}]`);
        }
    });
}


module.exports = {
    sendHtmlMail,
};
