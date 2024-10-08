// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getFirestore, collection, query, where, limit, getDocs, getDoc, addDoc, setDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSHgnL4cTw68_c0u2kIV-PFWcWedI2kUc",
  authDomain: "shoot-35ee6.firebaseapp.com",
  projectId: "shoot-35ee6",
  storageBucket: "shoot-35ee6.appspot.com",
  messagingSenderId: "277684891820",
  appId: "1:277684891820:web:3abaf9100e9f46048daf09",
  measurementId: "G-V3C4WD6TF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firestore and Auth functions
export { db, collection, app, query, where, limit, getDocs, getDoc, addDoc, auth, GoogleAuthProvider, signInWithPopup, signOut, doc, setDoc,updateDoc };
