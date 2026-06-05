// إعدادات Firebase الخاصة بك
// يرجى استبدال القيم أدناه بالقيم الخاصة بمشروعك من لوحة تحكم Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbhNumsq20K2fdhLahFb1QZnRcDsrmc8s",
  authDomain: "leo10-cf0e1.firebaseapp.com",
  projectId: "leo10-cf0e1",
  storageBucket: "leo10-cf0e1.firebasestorage.app",
  messagingSenderId: "735589436044",
  appId: "1:735589436044:web:3eaeee7eae5a295c19c9a9",
  measurementId: "G-W6H88EMCHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, deleteDoc, doc, signInWithEmailAndPassword, onAuthStateChanged, signOut };
