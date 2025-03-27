// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "candenttech.firebaseapp.com",
  projectId: "candenttech",
  storageBucket: "candenttech.firebasestorage.app",
  messagingSenderId: "796714169973",
  appId: "1:796714169973:web:3e10c02d39e61f85d12a3c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);