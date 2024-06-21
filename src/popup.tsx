import React, { useState, useEffect } from "react";
import Register from "~contents/Register";
import Login from "~contents/Login";
import { AuthProvider, useAuth } from "~contexts/AuthContext";
import "~styles/tailwind.css";

function IndexPopup() {
    const { email, setEmail } = useAuth();
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(["email"], function(result) {
            if (result.email) {
                setEmail(result.email);
            }
        });
    }, [setEmail]);

    const toggleReaderMode = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggle-reader-mode' });
        });
    };

    const handleShowRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleShowLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const handleBack = () => {
        setShowRegister(false);
        setShowLogin(false);
    };

    const handleLogout = () => {
        chrome.storage.local.remove(["token", "email"], function() {
            setEmail('');
            console.log('Token and email removed');
        });
    };

    return (
        <div className="flex flex-col p-4 w-80 bg-gray-100 rounded-lg shadow-md">
            {email && (
                <div className="flex justify-end items-center mb-4 space-x-4">
                    <p className="mt-2 text-blue-500 hover:text-blue-700 font-bold cursor-pointer ">{email}</p>
                    <p
                        onClick={handleLogout}
                        className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
                    >
                        Logout
                    </p>
                </div>
            )}
            {!showRegister && !showLogin && (
                <>
                    <button 
                        onClick={toggleReaderMode} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
                    >
                        Reader Mode
                    </button>
                    {!email &&
                    <div className="flex justify-end space-x-4">
                        <p 
                            onClick={handleShowRegister} 
                            className="text-gray-500 hover:text-gray-700 font- cursor-pointer underline"
                        >
                            Register
                        </p>
                        <p 
                            onClick={handleShowLogin} 
                            className="text-gray-500 hover:text-gray-700 font- cursor-pointer underline"
                        >
                            Login
                        </p>
                    </div>
                    }
                </>
            )}
            {showRegister && (
                <div>
                    <Register />
                    <p 
                        onClick={handleBack} 
                        className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
                    >
                        Back
                    </p>
                </div>
            )}
            {showLogin && (
                <div>
                    <Login />
                    <p 
                        onClick={handleBack} 
                        className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
                    >
                        Back
                    </p>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <IndexPopup />
        </AuthProvider>
    );
}

export default App;
