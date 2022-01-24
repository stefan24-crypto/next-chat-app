import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCEzOJ_FDe42r6hSjLQ9ee-vdDoYF8r3Qg",
  authDomain: "next-chat-app-9d445.firebaseapp.com",
  projectId: "next-chat-app-9d445",
  storageBucket: "next-chat-app-9d445.appspot.com",
  messagingSenderId: "793335825422",
  appId: "1:793335825422:web:a28c8f321587154350e85f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
