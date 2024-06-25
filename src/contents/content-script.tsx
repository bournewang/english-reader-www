import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Reader from "~components/Reader";
import { fetchMainArticleContent, addArticleFromDocument } from "~api/helper";
import { AuthProvider, useAuth } from "~contexts/AuthContext";

const ReaderApp = ({ overlay }) => {
    const { email } = useAuth();
    const [article, setArticle] = useState({ id: null, title: null, paragraphs: [], translations: [] });

    useEffect(() => {
        const fetchArticle = async () => {
            if (email) {
                const response = await addArticleFromDocument();
                if (response.success) {
                    setArticle(response.data);
                }
            } else {
                const articleContent = fetchMainArticleContent();
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
        newOverlay.style.display = "block";
        const styles = {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: 9999,
            border: '1px solid red',
            padding: '20px'
        };

        Object.assign(newOverlay.style, styles);
        document.body.appendChild(newOverlay);

        const root = createRoot(newOverlay);
        root.render(
            <AuthProvider>
                <ReaderApp overlay={newOverlay} />
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
