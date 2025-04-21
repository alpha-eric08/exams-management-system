import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVqGmGBaQmwMUvcjVTfRFqV2QRjnK8il8",
  authDomain: "alpha-f755d.firebaseapp.com",
  projectId: "alpha-f755d",
  storageBucket: "alpha-f755d.firebasestorage.app",
  messagingSenderId: "410834689824",
  appId: "1:410834689824:web:8476d90b2ac523f3e5c145",
  measurementId: "G-KMK77H1W2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);