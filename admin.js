const apiBase = "http://localhost:5000"; // Make sure your Node backend is running here

document.getElementById("loginBtn").addEventListener("click", async () => {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "admin" && pass === "admin123") {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";
    loadUsers();
  } else {
    alert("Invalid admin credentials.");
  }
});

async function loadUsers() {
  const res = await fetch(`${apiBase}/admin/users`);
  const data = await res.json();

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  data.users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.username}</td>
      <td>${user.accounts.join(", ")}</td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button></td>
    `;
    table.appendChild(tr);
  });
}

async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const res = await fetch(`${apiBase}/admin/user/${userId}`, {
    method: "DELETE"
  });

  const data = await res.json();
  if (data.success) {
    alert("User deleted.");
    loadUsers();
  } else {
    alert("Error deleting user.");
  }
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
})