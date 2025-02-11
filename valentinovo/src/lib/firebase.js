import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "valentinovo-128a4.firebaseapp.com",
    projectId: "valentinovo-128a4",
    storageBucket: "valentinovo-128a4.firebasestorage.app",
    messagingSenderId: "107725535097",
    appId: "1:107725535097:web:63066d9fac32ac214021a8",
    measurementId: "G-52HR781J21"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
