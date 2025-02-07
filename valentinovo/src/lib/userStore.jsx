import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true, // Start with loading true
    fetchUserInfo: async (uid) => {
        if (!uid) {
            set({ currentUser: null, isLoading: false });
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                set({ currentUser: userDoc.data(), isLoading: false });
            } else {
                set({ currentUser: null, isLoading: false }); // Prevent errors
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            set({ currentUser: null, isLoading: false });
        }
    },
}));
