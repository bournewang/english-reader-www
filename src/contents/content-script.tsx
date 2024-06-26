import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Reader from "~components/Reader";
import { fetchMainArticleContent, addArticleFromDocument } from "~api/helper";
import { AuthProvider, useAuth } from "~contexts/AuthContext";
import "~styles/tailwind.css";

const ReaderApp = ({ }) => {
    const { email } = useAuth();
    const [article, setArticle] = useState({ title: String, paragraphs: {}, translations: [], unfamiliar_words: [] });

    console.log("email: ", email);
    useEffect(() => {
        const fetchArticle = async () => {
            console.log("email in fetch article: ", email);
            if (email) {
                console.log("fetching article");
                const response = await addArticleFromDocument();
                if (response.success) {
                    setArticle(response.data);
                }
            } else {
                console.log("fetchMainArticleContent");
                const articleContent = fetchMainArticleContent();
                console.log(articleContent)
                setArticle(articleContent);
            }
        };

        fetchArticle();
    }, [email]);

    return (
        <Reader selectedArticle={article} />
    );
};

const createReader = async () => {
    const overlay = document.getElementById("english-reader-overlay");
    if (!overlay) {
        const newOverlay = document.createElement("div");
        newOverlay.id = "english-reader-overlay";
        newOverlay.className = "fixed top-0 left-0 w-full h-full bg-white z-50 border border-red-500 p-5"; // Tailwind CSS classes
        // // Add click event to close the overlay
        const closeReader = () => {
            newOverlay.style.display = "none";
        }
        document.body.appendChild(newOverlay);
        const root = createRoot(newOverlay);
        root.render(
            <AuthProvider>
                <ReaderApp />
                <button 
                    onClick={closeReader}
                    className="absolute top-2 right-2 px-4 py-2 text-white rounded cursor-pointer text-lg"
                    >❌</button>
            </AuthProvider>
        );
    } else {
        overlay.style.display = overlay.style.display === 'none' ? "block" : 'none';
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle-reader-mode") {
        createReader();
    }
});
