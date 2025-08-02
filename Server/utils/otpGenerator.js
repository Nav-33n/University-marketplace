const crypto = require('crypto');

module.exports = function generateOtp() {
  const otp = crypto.randomInt(100000, 999999); 
  return otp.toString();
}

