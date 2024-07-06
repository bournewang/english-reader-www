import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LocaleContextProps {
    locale: string | null;
    setLocale: (locale: string) => void;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const useLocale = (): LocaleContextProps => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<string | null>(null);

    useEffect(() => {
        // get from chrome storage
        chrome.storage.local.get('locale', (result) => {
            if (result.locale) {
                setLocaleState(result.locale);
            }
        });
    }, []);

    const setLocale = (locale: string) => {
        setLocaleState(locale);
        chrome.storage.local.set({ locale });
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};
