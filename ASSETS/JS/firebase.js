// ==================== ASSETS/JS/FIREBASE.JS ====================

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6TfZc-LJaPM583xR-rogn0V7H-Rx1Kmo",
    authDomain: "generador-93ce9.firebaseapp.com",
    databaseURL: "https://generador-93ce9-default-rtdb.firebaseio.com",
    projectId: "generador-93ce9",
    storageBucket: "generador-93ce9.firebasestorage.app",
    messagingSenderId: "888691198773",
    appId: "1:888691198773:web:7ae10d89dbc53b13d29a7c",
    measurementId: "G-EVR3CY1YQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Make Firebase available globally
window.firebase = {
    auth,
    database,
    ref,
    set,
    get,
    remove,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};

console.log('🔥 Firebase initialized successfully');

export { auth, database, ref, set, get, remove, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };