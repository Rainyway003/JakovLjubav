import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Waiting = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");
        const matchedWith = localStorage.getItem("matchedWith")

        if (!userId || !userEmail) {
            navigate("/login");
        } else {
            setUserData({ userId, userEmail, matchedWith });
        }
    }, [navigate]);

    const handleRedirect = () => {
        navigate("/");
    };

    if (!userData) {
        return <p>⏳ Učitavanje korisnika...</p>;
    }

    return (
        <div className="bg-red-300 flex flex-col items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-2xl font-bold mb-4">Čestitamo, {userData.userEmail}!</h2>
                <p className="text-gray-700 mb-4">
                    Račun je uspješno napravljen! Chat će se pokrenuti kad aplikacija bude završena, a do tada će ti Josip Knežević poslati PIN na uneseni broj.
                </p>
                <p className="text-sm text-gray-500 mb-4">Molimo vas za strpljenje dok čekate.</p>

                <button
                    onClick={handleRedirect}
                    className="mt-4 w-48 py-2 px-4 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-red-500"
                >
                    Vrati se na stranicu
                </button>

            </div>
        </div>
    );
};

export default Waiting;