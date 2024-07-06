import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Reader from "~components/Reader";
import { fetchMainArticleContent, addArticleFromDocument } from "~api/helper";
import { UserProvider, useUser } from "~contexts/UserContext";
import { LocaleProvider } from "~contexts/LocaleContext";
import type { Article } from "~api/article";

const ReaderApp = () => {
    const { user } = useUser();
    // type is Article
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            // console.log("user.email in fetch article: ", user.email);
            if (user && user.id) {
                console.log("fetching article");
                const response = await addArticleFromDocument();
                if (response.success) {
                    setArticle(response.data as Article);
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
    const newOverlay = document.createElement("div");
    newOverlay.id = "english-reader-overlay";
    newOverlay.style.position = "fixed";
    newOverlay.style.background = "white";
    newOverlay.style.top = "0";
    newOverlay.style.left = "0";
    newOverlay.style.width = "100%";
    newOverlay.style.height = "100%";
    newOverlay.style.zIndex = "99999";

    document.body.appendChild(newOverlay);

    // Create shadow root
    const shadowRoot = newOverlay.attachShadow({ mode: 'open' });
    const shadowContainer = document.createElement("html");
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

    const readerStyle = document.createElement("style");
    readerStyle.textContent = await fetchCSS(chrome.runtime.getURL("reader.css"));
    shadowRoot.appendChild(readerStyle);

    const closeReader = () => {
        const overlay = document.getElementById("english-reader-overlay");
        if (overlay)
            overlay.style.display = "none";
    };

    const root = createRoot(shadowContainer);
    root.render(
        <body>
            <UserProvider>
                <LocaleProvider>
                    <ReaderApp></ReaderApp>
                    <button
                        onClick={closeReader}
                        className="absolute top-0 right-0 px-4 py-2 text-white rounded cursor-pointer text-lg">
                        ❌
                    </button>
                </LocaleProvider>
            </UserProvider>
        </body>
    );
};


chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggle-reader-mode") {
        const overlay = document.getElementById("english-reader-overlay");
        if (overlay) {
            if (overlay.style.display === "block") {
                overlay.style.display = "none";
            } else {
                overlay.style.display = "block";
            }
        } else {
            createReader();
        }
    }
});
