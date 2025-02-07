import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Navigation hook

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("logged in");
            navigate("/"); // Redirect after successful login
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            console.log("Account created");
            navigate("/"); // Redirect after successful registration
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.currentUser) {
            navigate("/"); // If already logged in, redirect to "/"
        }
    }, []);

    return (
        <div className="Login">
            <div className="item">
                <h2>Welcome back</h2>
                <form onSubmit={handleLogin}>
                    <input className="text-black" type="email" placeholder="Email" name="email" required />
                    <input className="text-black" type="password" placeholder="Password" name="password" required />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign in"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create acc</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || './avatar.png'} alt="" />
                        Upload an image
                    </label>
                    <input className="text-black" type="file" id="file" style={{ display: 'none' }} onChange={handleAvatar} />
                    <input className="text-black" type="text" placeholder="Username" name="username" required />
                    <input className="text-black" type="email" placeholder="Email" name="email" required />
                    <input className="text-black" type="password" placeholder="Password" name="password" required />
                    <button disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
