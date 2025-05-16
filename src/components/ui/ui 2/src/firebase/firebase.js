// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuFurobgQBTpJRVlve8vruggTLcMsRGIc",
  authDomain: "tala-study-app.firebaseapp.com",
  projectId: "tala-study-app",
  storageBucket: "tala-study-app.firebasestorage.app",
  messagingSenderId: "988419751189",
  appId: "1:988419751189:web:9f074951dc77fe28cd3d1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { auth, firestore };
