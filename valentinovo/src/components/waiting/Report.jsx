import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../data/firebase/firebase";
import React, { useEffect, useState } from "react";

const Report = () => {
    const [matchedWith, setMatchedWith] = useState(null);
    const userId = localStorage.getItem("userId");

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
        if (matchedWith) {
            const userRef2 = doc(db, "users", matchedWith);
            const userSnap2 = await getDoc(userRef2);

            if (userSnap2.exists()) {
                await updateDoc(userRef2, {
                    reports: (parseInt(userSnap2.data().reports) + 1).toString()
                });
            }
        }
    };

    return (
        <button onClick={handleReport} className="mt-4 w-48 py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
            Prijavi korisnika
        </button>
    );
};

export default Report;
