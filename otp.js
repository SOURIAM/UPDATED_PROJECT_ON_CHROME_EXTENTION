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

require('dotenv').config();
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);

const nodemailer = require('nodemailer');

// filepath: c:\Users\flex zone\Downloads\PASS\jongo_pass_backend_mongo\otp.js

//const nodemailer = require('nodemailer');
//require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

function sendOTP(email, otp) {
  const mailOptions = {
    from: `"JONGO PASS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  return transporter.sendMail(mailOptions)
    .then(() => console.log(`OTP sent to ${email}`))
    .catch((error) => {
      console.error(`Failed to send OTP to ${email}:`, error);
      throw error; // Re-throw the error to be caught in the route
    });
}

module.exports = { generateOTP, storeOTP, verifyOTP, sendOTP };
