import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsz6eWpWXnczeA8EmmNu8P4jAJ9Fz7teQ",
  authDomain: "acs-group-8f700.firebaseapp.com",
  projectId: "acs-group-8f700",
  storageBucket: "acs-group-8f700.firebasestorage.app",
  messagingSenderId: "15923121111",
  appId: "1:15923121111:web:67e291a2665416049c5992",
  measurementId: "G-W5EQD1K2Y9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
