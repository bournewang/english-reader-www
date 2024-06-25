import React, { useState, FormEvent } from 'react';
import Register from './Register';
import { loginUser } from '~api/user';
import { useAuth } from '~contexts/AuthContext';
import "~styles/tailwind.css"

const Login: React.FC = () => {
    const { setEmail, error, setError } = useAuth();
    // const [error, setError] = useState('');
    // const [email, setEmail] = useState('');
    const [emailInput, setEmailInput] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [showRegister, setShowRegister] = useState(false);

    const handleShowRegister = () => {
        setShowRegister(true);
    };

    const handleBackToLogin = () => {
        setShowRegister(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginUser(emailInput, password);
            setToken(data.access_token);
            setEmail(emailInput);
            setError('');
            console.log("data.access_token", data.access_token);
            if (chrome?.storage?.local) {
                console.log("chrome.storage.local is available");
                chrome.storage.local.set({ token: data.access_token, email: emailInput }, function () {
                    console.log('Token and email are stored');
                });
            } else {
                console.error("chrome.storage.local is not available");
            }
        } catch (error) {
            setError(error.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col p-4 w-80 bg-gray-100 rounded-lg shadow-md">
            {!showRegister && (
                <div>
                    <div className="p-4 bg-white rounded shadow-md">
                        <h2 className="text-lg font-bold mb-4">Login</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                                Login
                            </button>
                        </form>
                        {error && <p className="mt-2 text-red-500">{error}</p>}
                        {token && <p className="mt-2 text-green-500">Token: {token}</p>}
                    </div>
                    <p
                        onClick={handleShowRegister}
                        className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
                    >
                        Register
                    </p>
                </div>
            )}
            {showRegister && (
                <div>
                    <Register />
                    <p
                        onClick={handleBackToLogin}
                        className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
                    >
                        Back to Login
                    </p>
                </div>
            )}
        </div>

    );
};

export default Login;
