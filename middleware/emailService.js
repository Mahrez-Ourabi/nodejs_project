// emailService.js

const nodemailer = require('nodemailer');
  // Create reusable transporter object using the default SMTP transport
 
  

const sendConfirmationEmail = async (email, reservationId, token) => {
    const confirmationLink = `http://localhost:3000/reservation/confirm-reservation/${reservationId}/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME, // Your Gmail email address
          pass: process.env.EMAIL_PASSWORD // Your Gmail app password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Confirm Your Reservation',
        html: `
            <p>Dear valued customer,</p>
            <p>We are pleased to inform you that your reservation has been successfully made.</p>
            <p>Please confirm your reservation by clicking the link below:</p>
            <p><a href="${confirmationLink}">Confirm Reservation</a></p>
            <p>If you did not make this reservation, please ignore this email.</p>
            <p>Thank you for choosing our service.</p>
            <p>Best regards,</p>
            <p>Your Reservation Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

// Function to send verification email for registration
const sendVerificationEmail = async (email, verificationCode) => {
    try {
      
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USERNAME, // Your Gmail email address
              pass: process.env.EMAIL_PASSWORD // Your Gmail app password
            },
            tls: {
              rejectUnauthorized: false
            }
          });

        // Setup email data
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Verify Your Email',
            html: `Your verification code is: ${verificationCode}`
        };
        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

module.exports = { sendConfirmationEmail, sendVerificationEmail};
