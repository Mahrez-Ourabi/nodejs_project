// emailService.js

const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (email, reservationId, token) => {
    const confirmationLink = `http://localhost/confirm-reservation/${reservationId}/${token}`;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: 'your@gmail.com',
        to: email,
        subject: 'Confirm Your Reservation',
        html: `Click <a href="${confirmationLink}">here</a> to confirm your reservation.`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendConfirmationEmail };
