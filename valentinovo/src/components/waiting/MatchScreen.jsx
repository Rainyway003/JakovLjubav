import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { matchUser } from "../../lib/firebaseDatabase";

const MatchScreen = () => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(true); // Ako korisnik čeka
  const [matchFound, setMatchFound] = useState(false); // Ako je partner pronađen
  const [waitingList, setWaitingList] = useState(false); // Ako je korisnik na čekanju
  const [userId, setUserId] = useState(null); // ID korisnika

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      navigate("/login"); // Ako korisnik nije prijavljen, preusmjeri ga na login
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  const handleJoinWaitingList = async () => {
    setWaitingList(true);
    setWaiting(false);

    // Ažuriraj korisnika da je na čekanju u bazi
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { waitingList: "true" });

      console.log("User added to waiting list in the database.");
    } catch (error) {
      console.error("Error updating waiting list: ", error);
    }

    // Provjeri ima li drugih korisnika na čekanju
    const userDoc = await getDoc(doc(db, "users", userId));
    const userGender = userDoc.data().gender;  // Preuzmi spol korisnika

    const matchedUserId = await matchUser(userId, userGender);
    if (matchedUserId) {
      // Ako je pronađen partner, provjeri da nije isti kao trenutni korisnik
      if (matchedUserId === userId) {
        console.log("Ne možete se spojiti sami sa sobom.");
        setWaitingList(false); // Prekini čekanje
        setWaiting(true);
        return; // Zaustavi daljnje izvršavanje
      }

      setMatchFound(true);
      try {
        const userRef = doc(db, "users", userId);
        const matchedUserRef = doc(db, "users", matchedUserId);

        // Ažuriraj oba korisnika
        await updateDoc(userRef, { matchedWith: matchedUserId, waitingList: "false" });
        await updateDoc(matchedUserRef, { matchedWith: userId, waitingList: "false" });

        console.log("Matched users successfully.");
      } catch (error) {
        console.error("Error updating users: ", error);
      }
    } else {
      // Ako nema partnera, ostavi korisnika na čekanju
      console.log("No match found, user added to waiting list.");
      setWaitingList(true); // Korisnik ostaje na čekanju
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-300">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4">Čekanje na partnera...</h2>

        {waiting ? (
          <button
            onClick={handleJoinWaitingList}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Pridruži se čekanju
          </button>
        ) : matchFound ? (
          <div>
            <h3 className="text-xl text-green-600">Partner pronađen!</h3>
            <p className="text-lg text-gray-700">Partner je uspješno spojen!</p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl text-orange-600">Na čekanju ste, tražimo novog partnera!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchScreen;
