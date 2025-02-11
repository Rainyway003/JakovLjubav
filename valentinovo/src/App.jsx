import { useState, useEffect } from "react";
import Chat from "./components/chat/Chat";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { useNavigate } from "react-router-dom";
import LoginScreen from "./components/login/LoginScreen";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase"; // Pretpostavimo da je ovo tvoj Firestore
import MatchScreen from "./components/waiting/MatchScreen";

// Funkcija za kreiranje chata
const createChat = async (currentUser) => {
  try {
    const matchedWith = currentUser.matchedWith;
    if (matchedWith) {
      // Generiraj chat ID baziran na korisničkim ID-ima
      const chatId = matchedWith < currentUser.id ? `${matchedWith}_${currentUser.id}` : `${currentUser.id}_${matchedWith}`;

      // Provjeri postoji li već chat između tih korisnika
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // Ako chat ne postoji, kreiraj novi chat
        await setDoc(chatRef, {
          users: [currentUser.id, matchedWith],  // Dodaj korisnike u chat
          messages: [],  // Prazna lista poruka
          createdAt: new Date(),
        });

        console.log(`Chat između ${currentUser.id} i ${matchedWith} kreiran sa chatId: ${chatId}`);
      } else {
        console.log("Chat već postoji.");
      }

      return chatId;  // Vrati chatId za daljnje korištenje
    }
  } catch (error) {
    console.error("Greška prilikom kreiranja chata:", error);
  }
};

// Funkcija za dohvatanje matched korisnika
const getMatchedUser = async (matchedUserId) => {
  try {
    const userRef = doc(db, "users", matchedUserId); // Pretpostavljamo da se korisnici nalaze u kolekciji "users"
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data(); // Vraćamo podatke o korisniku
    } else {
      throw new Error("Korisnik nije pronađen.");
    }
  } catch (error) {
    console.error("Greška pri dohvatu korisnika:", error);
    throw error;
  }
};

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, setChatId } = useChatStore(); // Dodano setChatId za postavljanje chatId-a
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true); // Track authentication check
  const [waiting, setWaiting] = useState(true); // Da pratimo status čekanja

  // Funkcija za promjenu chata
  const changeChat = (newChatId, matchedUser) => {
    setChatId(newChatId); // Postavljanje chatId u store
    console.log("Matched user:", matchedUser);
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      if (user) {
        navigate("/"); // Redirect to home after login
      }
      setCheckingAuth(false); // Done checking
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo, navigate]);

  // Dodavanje logike za kreiranje chata kad je korisnik matchan
  useEffect(() => {
    if (currentUser && currentUser.matchedWith && !chatId) {
      createChat(currentUser).then((newChatId) => {
        if (newChatId) {
          console.log("New chat ID:", newChatId);
          getMatchedUser(currentUser.matchedWith).then((matchedUser) => {
            if (matchedUser) {
              changeChat(newChatId, matchedUser); // Pozivanje changeChat s novim chatId i podacima korisnika
            }
          }).catch(error => console.error("Greška prilikom dohvata matchedUser-a:", error));
        }
      }).catch(error => console.error("Greška prilikom kreiranja chata:", error));
    }
  }, [currentUser, chatId]);

  if (isLoading || checkingAuth) return <div>Loading...</div>;

  console.log("Current User:", currentUser);
  console.log("Chat ID:", chatId);
  console.log("Checking Auth:", checkingAuth);
  console.log("Is Loading:", isLoading);

  return (
    <div className="containers">
      {currentUser ? (
        <>
          {chatId ? (
            <Chat />
          ) : (
            // Prikazivanje MatchScreen samo ako nije matchan ili je u čekanju
            waiting && <MatchScreen />
          )}
        </>
      ) : (
        <div style={{ visibility: "hidden", position: "absolute" }}>
          <LoginScreen />
        </div>
      )}
    </div>
  );
};

export default App;
