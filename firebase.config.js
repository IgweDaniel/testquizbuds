// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgN3vmd25-ap0GQZC0-JIuK0xiIfSD0Sw",
  authDomain: "quizbudz.firebaseapp.com",
  databaseURL: "https://quizbudz-default-rtdb.firebaseio.com",
  projectId: "quizbudz",
  storageBucket: "quizbudz.appspot.com",
  messagingSenderId: "444632404471",
  appId: "1:444632404471:web:d00720ed489a5cbb595ef2",
  measurementId: "G-8B1MFY6XW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore(app)
const analytics = getAnalytics(app);

export {auth, db}