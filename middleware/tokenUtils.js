const crypto = require('crypto');

// Function to generate a token
exports.generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to validate a token (if needed)
