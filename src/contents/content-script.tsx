import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Reader from "~components/Reader";
import { fetchMainArticleContent, addArticleFromDocument } from "~api/helper";
import { UserProvider, useUser } from "~contexts/UserContext";

const ReaderApp = ({ }) => {
    const { user } = useUser();
    const [article, setArticle] = useState({ title: String, paragraphs: {}, translations: [], unfamiliar_words: [] });

    useEffect(() => {
        const fetchArticle = async () => {
            // console.log("user.email in fetch article: ", user.email);
            if (user && user.id) {
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
    }, [user]);

    return (
        <>
            <Reader selectedArticle={article} />
        </>
    );
};

const createReader = async () => {
    const overlay = document.getElementById("english-reader-overlay");
    if (!overlay) {
        const newOverlay = document.createElement("div");
        newOverlay.id = "english-reader-overlay";
        newOverlay.style.position = "fixed";
        newOverlay.style.top = "0";
        newOverlay.style.left = "0";
        newOverlay.style.width = "100%";
        newOverlay.style.height = "100%";
        newOverlay.style.zIndex = "99999";
        
        document.body.appendChild(newOverlay);

        // Create shadow root
        const shadowRoot = newOverlay.attachShadow({ mode: 'open' });
        const shadowContainer = document.createElement("body");
        shadowRoot.appendChild(shadowContainer);

        const fetchCSS = async (url) => {
            const response = await fetch(url);
            return response.text();
        };

        // get chrome extension dynamic url
        const extensionUrl = chrome.runtime.getURL("tailwind.css");
        const tailwindCSS = await fetchCSS(extensionUrl);
        const style = document.createElement("style");
        style.textContent = tailwindCSS;
        shadowRoot.appendChild(style);

        // load some inline styles
        const inlineStyle = document.createElement("style");
        inlineStyle.textContent = `
        :host {
            all: initial; 
            font-size: 16px;
        }

        .prose :where(tbody tr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            border-bottom-width: 0px !important; 
            border-bottom-color: var(--tw-prose-td-borders);
        }
        .prose :where(table):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
            font-size: 1em;
        }

        .prose-lg :where(tbody td, tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-top: 0.3em;
            padding-bottom: 0.3em;
        }

        .prose-lg :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.3em;
            margin-bottom: 0.3em;
        }
        `;
        shadowRoot.appendChild(inlineStyle);

        const closeReader = () => {
            newOverlay.style.display = "none";
        };

        const root = createRoot(shadowContainer);
        root.render(
            <UserProvider>
                <ReaderApp></ReaderApp>
                <button 
                    onClick={closeReader}
                    className="absolute top-2 right-2 px-4 py-2 text-white bg-red-500 rounded cursor-pointer text-lg">
                    ❌
                </button>
            </UserProvider>
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
