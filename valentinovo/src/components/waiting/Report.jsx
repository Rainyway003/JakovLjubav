import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { DislikeOutlined } from '@ant-design/icons';

const Report = () => {
    const [matchedWith, setMatchedWith] = useState(null);
    const userId = localStorage.getItem("userId");
    const { user } = useChatStore();
    const { currentUser } = useUserStore();

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setMatchedWith(userSnap.data().matchedWith);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleReport = async () => {
        if (!matchedWith || matchedWith !== user?.id) return;

        const userRef = doc(db, "users", matchedWith);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const reports = userData.reports || 0;
            const reportedBy = userData.reportedBy || [];
            const hasReported = userData.hasReported || false; // Provjera ako je korisnik već prijavio

            if (hasReported) {
                alert("Već ste prijavili ovog korisnika.");
                return;
            }

            // Ako nije prijavio, izvrši prijavu
            await updateDoc(userRef, {
                reports: reports + 1,
                reportedBy: arrayUnion(currentUser.id + " " + currentUser.username),
                hasReported: true, // Označi da je korisnik prijavio
            });

            alert("Korisnik je prijavljen.");
        }
    };

    return (
        <div>
            <button
                onClick={handleReport}
                className="mt-4 w-32 h-12 py-2 pl-4 px-4 bg-red-300 text-white rounded-lg shadow-md hover:bg-red-400 flex items-center justify-center mb-4 gap-2"
            >
                <DislikeOutlined />
                Prijavi korisnika
            </button>
        </div>
    );
};

export default Report;
