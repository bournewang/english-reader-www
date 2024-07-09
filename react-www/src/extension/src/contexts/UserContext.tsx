import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { attachTokenInterceptor } from '~api/api';

interface User {
  id: number;
  email: string;
  premium: boolean;
  expires_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['user', 'accessToken'], (result) => {
      if (result.user) setUser(result.user);
      if (result.accessToken) {
        setAccessToken(result.accessToken);
        attachTokenInterceptor(result.accessToken);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      chrome.storage.local.set({ user });
    } else {
      chrome.storage.local.remove('user');
    }

    if (accessToken) {
      chrome.storage.local.set({ accessToken });
      attachTokenInterceptor(accessToken);
    } else {
      chrome.storage.local.remove('accessToken');
    }
  }, [user, accessToken]);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    chrome.storage.local.remove('user');
    chrome.storage.local.remove('accessToken');
  };

  return (
    <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
