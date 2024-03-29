const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');


// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isadmin = email.endsWith('-admin@gmail.com');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isadmin,

    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Construct verification link
    const verificationLink = `${req.protocol}://${req.get('host')}/verify-email/${token}`;

    // Send verification email
    await sendVerificationEmail( email , verificationLink);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


// Function to send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME, // Your Gmail email address
        pass: process.env.EMAIL_PASSWORD // Your Gmail password or app password
      }
    });

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Verify Your Email',
      text: `Click on the following link to verify your email: ${verificationLink}`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    // render to vue login page
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};



// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Logout user
exports.logout = (req, res) => {
    try {
        // Clear the JWT token from the client-side
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to logout' });
    }
};