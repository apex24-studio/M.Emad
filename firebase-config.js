// إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyDbhNumsq20K2fdhLahFb1QZnRcDsrmc8s",
  authDomain: "leo10-cf0e1.firebaseapp.com",
  projectId: "leo10-cf0e1",
  storageBucket: "leo10-cf0e1.firebasestorage.app",
  messagingSenderId: "735589436044",
  appId: "1:735589436044:web:3eaeee7eae5a295c19c9a9",
  measurementId: "G-W6H88EMCHK"
};

// Initialize Firebase globally using compat SDK
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
