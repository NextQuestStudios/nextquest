// admin/admin.js
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "/login.html";
  } else {
    // Optional: Check user role from Firestore
  }
});
