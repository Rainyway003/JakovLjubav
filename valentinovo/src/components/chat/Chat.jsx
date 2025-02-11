import { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, collection, deleteDoc, deleteField, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { auth, db } from "../../lib/firebase"
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import { useNavigate } from 'react-router'
import Report from '../waiting/Report'
import TermsPopup from '../waiting/TermsPopup'

const Chat = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [chat, setChat] = useState();
    const [text, setText] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [dogovoreno, setDogovoreno] = useState(false)
    const navigate = useNavigate();
    const endRef = useRef(null);

    const { currentUser } = useUserStore();
    const { chatId, setChatId, user, changeChat } = useChatStore();

    useEffect(() => {
        const fetchMatchedChat = async () => {
            if (!currentUser) return;

            try {
                const userRef = doc(db, "users", currentUser.id);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const matchedWith = userSnap.data().matchedWith;

                    if (matchedWith) {
                        const matchedChatId = matchedWith < currentUser.id ? `${matchedWith}_${currentUser.id}` : `${currentUser.id}_${matchedWith}`;
                        setChatId(matchedChatId);

                        const matchedUserRef = doc(db, "users", matchedWith);
                        const matchedUserSnap = await getDoc(matchedUserRef);

                        if (matchedUserSnap.exists()) {
                            changeChat(matchedChatId, matchedUserSnap.data(), currentUser);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching matched chat:", err);
            }
        };

        fetchMatchedChat();
    }, [currentUser, setChatId, changeChat]);


    useEffect(() => {
        if (!chatId) return;
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());

            const userMessages = res.data()?.messages?.filter(msg => msg.senderId === currentUser.id) || [];
            setMessageCount(userMessages.length);
        });
        return () => unSub();
    }, [chatId]);


    useEffect(() => {
        if (!currentUser?.id) return;

        const userRef = doc(db, "users", currentUser.id);

        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDogovoreno(data.dogovoreno ?? false);
            } else {
                console.log('error')
            }
        });

        return () => unsubscribe();
    }, [currentUser]);


    const handleSend = async () => {
        if (text === "" || (dogovoreno === false && messageCount >= 5)) return;

        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                })
            });

            setText("");
        } catch (err) {
            console.log(err);
        }
    };



    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    const handleKava = async () => {

        if (dogovoreno == false) {
            const userRef = doc(db, "users", currentUser.id);
            setDogovoreno(true);

            try {
                await updateDoc(userRef, { dogovoreno: true });
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <div className="chat">
            {isOpen && <TermsPopup onClose={handleClose} />}
            <div className="top">
                <div className="user">
                    <div className="texts">
                        <span>{"Nepoznata Osoba"}</span>
                        {dogovoreno ? (
                            <p></p>
                        ) : (
                            <p>Možeš poslati još {5 - messageCount} poruka.</p>
                        )}
                    </div>
                    <Report />
                    <button
                        onClick={handleKava}
                        className={`py-1 px-2 w-16 text-sm rounded-md text-white font-semibold transition duration-300 ease-in-out ${dogovoreno ? "bg-green-400 hover:bg-green-500" : "bg-red-400 hover:bg-red-500"
                            }`}
                    >
                        {dogovoreno ? "✔" : "Kava?☕"}
                    </button>
                </div>
                <div className="icons pl-4">
                    <button className='Logout' onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message, index) => (
                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={index}>
                        <div className="texts">
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <input type="text"
                    value={text}
                    placeholder='Type a message...'
                    onChange={e => setText(e.target.value)}
                    disabled={dogovoreno ? false : messageCount >= 5}
                />
                <button
                    className='sendButton'
                    onClick={handleSend}
                    disabled={dogovoreno ? false : messageCount >= 5}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;