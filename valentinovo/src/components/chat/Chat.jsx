import { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { auth, db } from "../../lib/firebase"
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import { useNavigate } from 'react-router'

const Chat = () => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

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
        });
        return () => unSub();
    }, [chatId]);

    const handleSend = async () => {
        if (text === "") return;
        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                })
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>{user?.username || "Unknown"}</span>
                        <p>Lorem ipsum dolor sit amet</p>
                    </div>
                </div>
                <div className="icons">
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
                    onChange={e => setText(e.target.value)} />
                <button className='sendButton' onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;

