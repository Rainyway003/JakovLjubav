import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "valentinesdaychat-c2c11.firebaseapp.com",
    projectId: "valentinesdaychat-c2c11",
    storageBucket: "valentinesdaychat-c2c11.firebasestorage.app",
    messagingSenderId: "45374779400",
    appId: "1:45374779400:web:7cdf18fee47eb4b821a1bd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
