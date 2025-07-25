// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAN059kR5TiCOUSDtZ2tOnc_TV9yOtUpSM",
  authDomain: "chads-47328.firebaseapp.com",
  projectId: "chads-47328",
  storageBucket: "chads-47328.firebasestorage.app",
  messagingSenderId: "171866423618",
  appId: "1:171866423618:web:261180489f63e994ae08db",
  measurementId: "G-MM47BD62KK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);