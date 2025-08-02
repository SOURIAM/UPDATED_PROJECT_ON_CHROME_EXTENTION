const sendOtpBtn = document.getElementById('send-otp');
const verifyOtpBtn = document.getElementById('verify-otp');
const emailSection = document.getElementById('email-section');
const otpSection = document.getElementById('otp-section');
const profileSection = document.getElementById('profile-section');

sendOtpBtn.onclick = () => {
  const email = document.getElementById('email').value.trim();
  if (!email) return alert('Please enter a valid email');

  // Simulate sending OTP
  alert(`OTP sent to ${email}`);
  otpSection.classList.remove('hidden');
};

verifyOtpBtn.onclick = () => {
  const otp = document.getElementById('otp').value.trim();
  if (!otp) return alert('Please enter the OTP');

  // Simulate OTP verification and show profile
  alert('OTP verified successfully');

  // Dummy data for demo
  document.getElementById('username').textContent = 'Username: johndoe';
  const accounts = ['example.com', 'another-site.com'];
  const list = document.getElementById('accounts-list');
  list.innerHTML = '';
  accounts.forEach(site => {
    const li = document.createElement('li');
    li.textContent = site;
    list.appendChild(li);
  });

  profileSection.classList.remove('hidden');
};
