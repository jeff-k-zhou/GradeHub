// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADHXjXcESDsddVFCXP1k0U7A41EbackiU",
  authDomain: "gradehub-analytics.firebaseapp.com",
  projectId: "gradehub-analytics",
  storageBucket: "gradehub-analytics.appspot.com",
  messagingSenderId: "182492735055",
  appId: "1:182492735055:web:cc592b03e95ad89136ec3a",
  measurementId: "G-M0KZTNQ4YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);