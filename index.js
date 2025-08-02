require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { generateOTP, storeOTP, verifyOTP } = require('./otp');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  storeOTP(email, otp);

  try {
    await transporter.sendMail({
      from: `"JONGO PASS" <\${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your JONGO PASS OTP',
      text: `Your OTP is: <\${otp}>`
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Email failed' });
  }
});

// Verify OTP & fetch/create profile
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!verifyOTP(email, otp)) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      email,
      username: email.split('@')[0],
      accounts: []
    });
    await user.save();
  }

  res.json({ success: true, profile: user });
});

// Add a site to the user's account list
app.post('/add-account', async (req, res) => {
  const { email, site } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ success: false });

  if (!user.accounts.includes(site)) {
    user.accounts.push(site);
    await user.save();
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`JONGO PASS server running on port <\${PORT}>`));
