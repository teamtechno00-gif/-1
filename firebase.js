/* firebase.js - تهيئة Firebase (بيتحمّل في الموقع وفي لوحة التحكم) */
firebase.initializeApp({
  apiKey: "AIzaSyCel1QXKeChW1zVhQn4I8k8lVrD5c-OX9s",
  authDomain: "hellw-elmalek.firebaseapp.com",
  projectId: "hellw-elmalek",
  storageBucket: "hellw-elmalek.firebasestorage.app",
  messagingSenderId: "742581978284",
  appId: "1:742581978284:web:81bc15b3a2168b5ecb4b09"
});
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage ? firebase.storage() : null;   // الموقع مش محتاج Storage
const TS = firebase.firestore.FieldValue.serverTimestamp;
// Firebase Auth بيحتاج إيميل، فبنحوّل رقم الموبايل لإيميل داخلي (العميل مش بيشوفه)
const phoneEmail = (p) => p + '@helwelmalek.app';
