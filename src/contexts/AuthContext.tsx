import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    email: string;
    setEmail: (email: string) => void;
    token: string;
    setToken: (token: string) => void;
    error: string;
    setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log("AuthProvider: email, token, error", email, token, error);
        chrome.storage.local.get(['email', 'token'], (result) => {
            console.log("chrome.storage.local.get(['email', 'token'],");
            console.log(result)
          if (result.email && result.token) {
            setEmail(result.email);
            setToken(result.token);
          }
        });
      }, []);

    return (
        <AuthContext.Provider value={{ email, setEmail, token, setToken, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

