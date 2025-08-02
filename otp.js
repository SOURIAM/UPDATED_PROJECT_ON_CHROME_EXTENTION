const otps = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  otps[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
}

function verifyOTP(email, inputOtp) {
  const record = otps[email];
  if (!record) return false;
  const valid = record.otp === inputOtp && Date.now() < record.expires;
  if (valid) delete otps[email];
  return valid;
}

module.exports = { generateOTP, storeOTP, verifyOTP };
