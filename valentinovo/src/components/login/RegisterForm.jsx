// RegisterForm
import { Form, useNavigate } from "react-router-dom";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useEffect, useState } from "react";
import './form.css'
import { auth } from "../../lib/firebase";

const RegisterForm = () => {
    const [visible, setVisible] = useState(false)
    const [gender, setGender] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        if (auth.currentUser) {
            navigate("/"); // ili neku drugu stranicu na koju želiš preusmjeriti
        }
    }, [navigate]);

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    return (
        <div className="heart">
            <Form method="post">
                <div className="form-content">
                    <input type="hidden" name="formId" value="register" />
                    <h1 className="form-title text-xl font-bold text-center text-red-100 mb-4">
                        Registriraj se da napraviš račun!
                    </h1>

                    {/* Gornji div */}
                    <div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="form-input w-64 h-8 px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600"
                            placeholder="Ime i Prezime"
                            required
                        />
                    </div>

                    {/* Srednji div (E-mail i broj telefona) */}
                    <div className="flex space-x-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input w-44 h-8 px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600"
                            placeholder="Adresa e-pošte"
                            required
                        />
                        <input
                            id="number"
                            name="number"
                            type="tel"
                            className="form-input w-44 h-8 px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600 pr-10"
                            placeholder="Broj Telefona"
                            required
                        />
                    </div>

                    {/* Donji div (Lozinka i dugme za prikaz lozinke) */}
                    <div className="relative w-64">
                        <input
                            id="password"
                            name="password"
                            type={visible ? "text" : "password"}
                            className="form-input w-full h-8 px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-pink-600 pr-10"
                            placeholder="Lozinka"
                            required
                        />
                        <div
                            className="toggle-visibility absolute right-2 top-2 cursor-pointer"
                            onClick={toggleVisibility}
                        >
                            {visible ? <HeartFilled /> : <HeartOutlined />}
                        </div>
                    </div>

                    {/* Div za pol */}
                    <div className="flex top-12">
                        <input
                            id="male"
                            type="radio"
                            name="gender"
                            value="male"
                            className="ml-2 mr-4"
                            onChange={handleGenderChange}
                            required
                        />
                        <label htmlFor="male" className="text-gray-200">Muško</label>

                        <input
                            id="female"
                            type="radio"
                            name="gender"
                            value="female"
                            className="ml-4 mr-2"
                            onChange={handleGenderChange}
                            required
                        />
                        <label htmlFor="female" className="text-gray-200">Ženško</label>
                    </div>

                    <button
                        type="submit"
                        className="form-button w-32 font-bold bg-red-300 text-white py-3 px-4 rounded-xl text-sm mt-1 transition-all duration-500 ease-in-out hover:bg-red-400"
                    >
                        Registriraj se
                    </button>
                </div>
            </Form>
        </div>


    );
};

export default RegisterForm;