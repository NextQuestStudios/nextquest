// admin.js

// Firebase initialization is already done via firebase-config.js
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const userId = user.uid;
  const userDoc = await firebase.firestore().collection("users").doc(userId).get();

  if (!userDoc.exists) {
    alert("Unauthorized access.");
    firebase.auth().signOut();
    window.location.href = "/login.html";
    return;
  }

  const userData = userDoc.data();
  const role = userData.role;

  if (!["owner", "co_owner", "admin", "moderator"].includes(role)) {
    alert("Access denied. You do not have admin privileges.");
    firebase.auth().signOut();
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("adminInfo").textContent = `Logged in as: ${userData.username || user.email} (${role})`;

  // Mock Stats (replace with Firestore queries)
  document.getElementById("totalUsers").textContent = "Loading...";
  document.getElementById("openTickets").textContent = "Loading...";
  document.getElementById("totalItems").textContent = "Loading...";
  document.getElementById("totalNPCs").textContent = "Loading...";

  // Example count data (replace with real Firestore logic)
  firebase.firestore().collection("users").get().then(snapshot => {
    document.getElementById("totalUsers").textContent = snapshot.size;
  });

  firebase.firestore().collection("supportTickets").where("status", "in", ["Open", "In Progress"]).get().then(snapshot => {
    document.getElementById("openTickets").textContent = snapshot.size;
  });

  firebase.firestore().collection("items").get().then(snapshot => {
    document.getElementById("totalItems").textContent = snapshot.size;
  });

  firebase.firestore().collection("npcs").get().then(snapshot => {
    document.getElementById("totalNPCs").textContent = snapshot.size;
  });
});

// Tab switcher
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  const tabButtons = document.getElementsByClassName("tablink");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}
