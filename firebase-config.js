// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPCaU0Z0AGjDEnscTEB5fnqdlfVcsMNaI", // <-- REPLACE WITH YOUR ACTUAL API KEY
  authDomain: "my-project-60d48.firebaseapp.com",
  projectId: "my-project-60d48",
  storageBucket: "my-project-60d48.firebasestorage.app",
  messagingSenderId: "726548635832",
  appId: "1:726548635832:web:52c8d826dc60e63289944d",
  measurementId: "G-64BFKTK0BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, database, auth };
