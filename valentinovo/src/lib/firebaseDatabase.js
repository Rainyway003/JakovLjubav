import {
    doc,
    getFirestore,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";

const db = getFirestore();

export const saveUser = async (userId, user) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, user, { merge: true })
}

export const matchUser = async (userId, gender) => {
    const usersRef = collection(db, "users");
    const oppositeGender = gender === "male" ? "female" : "male";

    const q = query(
        usersRef,
        where("gender", "==", oppositeGender),
        where("matchedWith", "==", ""),
        where("waitingList", "==", "true")
    );

    const querySnapshot = await getDocs(q);

    console.log(`Found ${querySnapshot.size} users to match with`); // Provjeri broj korisnika

    if (!querySnapshot.empty) {
        const matchedUser = querySnapshot.docs[0];
        const matchedUserId = matchedUser.id;

        // Ako je korisnik već spojen sa nekim, preskoči
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        const user = userDoc.data();

        if (user.matchedWith && user.matchedWith !== "") {
            console.log("User is already matched with someone.");
            return null; // Korisnik je već u vezi
        }

        const matchedUserRef = doc(db, "users", matchedUserId);
        const matchedUserDoc = await getDoc(matchedUserRef);
        if (matchedUserDoc.exists() && matchedUserDoc.data().matchedWith !== "") {
            console.log("The matched user is already taken, no match available.");
            return null; // Ako je već u vezi s nekim, ne možeš ga povezati
        }

        // Ažuriraj oba korisnika
        await updateDoc(userRef, { matchedWith: matchedUserId, waitingList: "false" });
        await updateDoc(matchedUserRef, { matchedWith: userId, waitingList: "false" });

        console.log(`Matched user ${userId} with ${matchedUserId}`);
        return matchedUserId;
    }

    console.log("No available user found to match.");
    return null;
};
