// Back to Top Button
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Admin Login Button
document.getElementById("adminLoginBtn").addEventListener("click", () => {
  window.location.href = "/admin/login.html";
});