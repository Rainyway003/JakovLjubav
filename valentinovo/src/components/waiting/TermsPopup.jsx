import React from "react";

const TermsPopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-80 sm:w-[400px]">
                <h2 className="text-xl font-bold mb-4">Pravila korištenja</h2>
                <p className="mb-4">Dobrodošli! Prije nego nastavite, molimo vas da pročitate naša pravila korištenja.</p>
                <ul className="list-disc pl-5 mb-4">
                    <li>Budite pristojni i poštujte druge korisnike.</li>
                    <li>Izbjegavajte vrijeđanje, prijetnje i agresivne izraze.</li>
                    <li>Ne dijelite informacije kao što su školski razred, godine, ime i prezime.</li>
                    <li>Izbjegavajte spamovanje i slanje neželjenih poruka(Ograničeni ste na 5 poruka).</li>
                    <li>Prijavite neprimjereno ponašanje administratorima stranice.</li>
                    <li>Nakon razmijenjenih 5 poruka, obavezno otiđite na kavu.</li>
                    <li>Uživajte!</li>
                </ul>
                <button
                    onClick={onClose}
                    className="bg-red-400 text-white py-2 px-4 rounded w-full hover:bg-red-300">
                    Prihvaćam
                </button>
            </div>
        </div>
    );
};

export default TermsPopup;