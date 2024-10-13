// src/firebase.js
import { getFirestore } from "firebase/firestore"
// TODO: Remove API key from production
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"; // Import Firebase Analytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCitYtPYZbNI_bU4fFP2IukoPr9pE6z2mA",
  authDomain: "workout-tracker-172db.firebaseapp.com",
  projectId: "workout-tracker-172db",
  storageBucket: "workout-tracker-172db.appspot.com",
  messagingSenderId: "131724558710",
  appId: "1:131724558710:web:884dc2730d49a1f26d3a57",
  measurementId: "G-FHG0LF1S3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Firebase Analytics


const db = getFirestore(app); // Initialize Firestore
export { db };

// Export the authentication module
export const auth = getAuth(app);
