// /public/shared/firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvL4-Mu7wkXdV15hSgh2LCK2nZ1_pk6zQ",
  authDomain: "nextqueststudio.firebaseapp.com",
  projectId: "nextqueststudio",
  storageBucket: "nextqueststudio.firebasestorage.app",
  messagingSenderId: "299726625043",
  appId: "1:299726625043:web:849a5ef49be102603f22e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);