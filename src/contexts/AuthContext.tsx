import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    email: string;
    setEmail: (email: string) => void;
    error: string;
    setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    return (
        <AuthContext.Provider value={{ email, setEmail, error, setError }}>
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

