// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";

// Firebase configuration for NextQuestStudio
const firebaseConfig = {
  apiKey: "AIzaSyDvL4-Mu7wkXdV15hSgh2LCK2nZ1_pk6zQ",
  authDomain: "nextqueststudio.firebaseapp.com",
  projectId: "nextqueststudio",
  storageBucket: "nextqueststudio.appspot.com",
  messagingSenderId: "299726625043",
  appId: "1:299726625043:web:849a5ef49be102603f22e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
