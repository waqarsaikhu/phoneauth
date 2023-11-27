// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwFZMh8GIVxz27TWSRv_Idk-fe0G8yadM",
  authDomain: "react-app-b9d6e.firebaseapp.com",
  projectId: "react-app-b9d6e",
  storageBucket: "react-app-b9d6e.appspot.com",
  messagingSenderId: "158927518689",
  appId: "1:158927518689:web:781019b8ccd9561ae730a0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);
