import { Form, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './form.css';
import { auth } from "../../lib/firebase";

const LoginForm = () => {
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if (auth.currentUser) {
            navigate("/"); // ili neku drugu stranicu na koju želiš preusmjeriti
        }
    }, [navigate]);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const toggleVisibility2 = () => {
        setVisible2(!visible2);
    };


    return (
        <div className="heart">
            <Form method="post">
                <div className="form-content">
                    <h1 className="form-title text-xl font-bold text-center text-red-100 mb-4">
                        Prijavi se da pristupiš računu!
                    </h1>
                    <input type="hidden" name="formId" value="login" />
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input w-64 px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600"
                            placeholder="Adresa e-pošte"
                            required
                        />
                    </div>
                    <div className="relative w-64">
                        <input
                            id="password"
                            name="password"
                            type={visible ? "text" : "password"}
                            className="form-input w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600 pr-10"
                            placeholder="Lozinka"
                            required
                        />
                        <div
                            className="toggle-visibility absolute right-2 top-2 cursor-pointer"
                            onClick={toggleVisibility} // Dodajte onClick event
                        >
                            {visible ? <HeartFilled /> : <HeartOutlined />}
                        </div>
                    </div>
                    <div className="relative w-64">
                        <input
                            id="pin"
                            name="pin"
                            type={visible2 ? "text" : "password"}
                            className="form-input w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600 pr-10"
                            placeholder="Pin"
                            required
                        />
                        <div
                            className="toggle-visibility absolute right-2 top-2 cursor-pointer"
                            onClick={toggleVisibility2} // Dodajte onClick event
                        >
                            {visible2 ? <HeartFilled /> : <HeartOutlined />}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="form-button w-40 font-bold bg-red-300 text-white py-3 px-4 rounded-xl text-sm mt-4 transition-all duration-500 ease-in-out hover:bg-red-400"
                    >
                        Prijavite se
                    </button>
                </div>
            </Form>
        </div>

    );
};

export default LoginForm;