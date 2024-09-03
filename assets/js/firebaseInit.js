    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
    import { getFirestore, collection, query, where, limit, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

    // Export Firestore functions
    export { db, collection, query, where, limit, getDocs, addDoc, app };