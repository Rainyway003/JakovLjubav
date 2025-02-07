import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import store from "../store/store.js";
import { useUserStore } from "./userStore";
import { saveUser } from "./firebaseDatabase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();


export const getLoggedInUser = () => {
    return useUserStore.getState().currentUser;
};

export const signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user
        localStorage.setItem("token", user.accessToken)
        localStorage.setItem("userId", user.uid); // Pohranjuje userId u localStorage
        localStorage.setItem("userEmail", user.email); // Pohranjuje userEmail u localStorage
        return { user }
    } catch (error) {
        console.error(error)
        return { error }
    }
}

export const registerUser = async (username, email, password, gender, number) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user
        const userData = {
            id: user.uid,
            email: email,
            username: username,
            gender: gender || "unknown",
            number: number,
            matchedWith: "",
            pin: "",
            waitingList: "",
            reports: "0"
        }
        await setDoc(doc(db, "userchats", userCredential.user.uid), {
            chats: [],
        });
        await saveUser(user.uid, userData)
        // const matchedUserId = await matchUser(user.uid, gender);
        localStorage.setItem("token", user.accessToken)
        localStorage.setItem("userId", user.uid); // Pohranjuje userId u localStorage
        localStorage.setItem("userEmail", user.email); // Pohranjuje userEmail u localStorage
        // return { user, matchedWith: matchedUserId }
    } catch (error) {
        console.error(error)
        return { error }
    }
}

export const signOutUser = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
}