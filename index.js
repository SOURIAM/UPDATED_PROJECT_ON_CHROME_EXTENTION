require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { generateOTP, storeOTP, verifyOTP, sendOTP } = require('./otp');
const User = require('./models/User');

const app = express(); // Initialize the app here
app.use(cors()); // Use CORS after initializing the app
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  storeOTP(email, otp);

  try {
    await sendOTP(email, otp);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' }); // Send JSON response
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
      accounts: [],
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

// Get user accounts
app.get('/accounts/:email', async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, accounts: user.accounts });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`JONGO PASS server running on port ${PORT}`);
});