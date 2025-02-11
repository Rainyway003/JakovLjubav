import React from "react";

const TermsPopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-80 sm:w-[400px] shadow-lg">
                <h2 className="text-3xl font-bold text-red-400 text-center mb-4">Pravila korištenja</h2>
                <p className="mb-4 text-black">Kako bi smanjili ponavljanje pitanja, pročitajte i poštujte sljedeća pravila:</p>
                <ul className="list-disc pl-5 mb-4 text-black">
                    <li>Budite pristojni i poštujte druge korisnike.</li>
                    <li>U slučaju prijave vaše poruke (ako je neprimjerena), ona će biti poslana nastavnicima na daljnje postupanje.</li>
                    <li>Ne dijelite osobne podatke poput imena, prezimena, razreda ili godina.</li>
                    <li>Izbjegavajte spam i slanje neželjenih poruka. (Ograničeni ste na 5 poruka).</li>
                    <li>Prijavite neprimjereno ponašanje ili kršenja pravila administratorima.</li>
                </ul>
                <p className="mb-4 text-black">
                    <strong>Zapamtite!</strong> Biranje korisnika je nasumično i nemamo utjecaja na ponašanje drugih osoba.
                </p>
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