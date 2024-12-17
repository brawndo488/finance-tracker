// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1W3vO1Wgp4dEdVr7AEZ3HoqNLRyHWezA",
  authDomain: "finance-tracker-6783e.firebaseapp.com",
  projectId: "finance-tracker-6783e",
  storageBucket: "finance-tracker-6783e.firebasestorage.app",
  messagingSenderId: "843910288804",
  appId: "1:843910288804:web:65f35a7e38c35786769d31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export {app, db, auth}; 