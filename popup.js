document.addEventListener("DOMContentLoaded", () => {
  const sendOtpBtn = document.getElementById("send-otp");
  const verifyOtpBtn = document.getElementById("verify-otp");

  const emailSection = document.getElementById("email-section");
  const otpSection = document.getElementById("otp-section");
  const profileSection = document.getElementById("profile-section");

  sendOtpBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) return alert("Please enter a valid email");
  
    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        alert(`OTP sent to ${email}`);
        otpSection.classList.remove("hidden");
      } else {
        alert(data.message); // Display the error message from the backend
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Could not send OTP.");
    }
  };

  verifyOtpBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();
    if (!otp) return alert("Please enter the OTP");

    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified successfully");
        const user = data.user;

        // Display profile
        document.getElementById("username").textContent = `Username: ${user.username}`;
        const list = document.getElementById("accounts-list");
        list.innerHTML = "";
        user.accounts.forEach(site => {
          const li = document.createElement("li");
          li.textContent = site;
          list.appendChild(li);
        });

        profileSection.classList.remove("hidden");
      } else {
        alert("Invalid or expired OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to verify OTP.");
    }
  };
});
