import React, { useEffect, useState, useContext } from "react";
import DictWrap from "./DictWrap";
import { fetchDefinition } from "~api/dict";
import { translateText } from "~api/translate";
import "../styles/overlay.css"

const Reader = ({ onClose }) => {
    const [word, setWord] = useState(false);
    const [definition, setDefinition] = useState(false);
    const [bilingualMode, setBilingualMode] = useState(false);
    //   const shadowRoot = useContext(ShadowRootContext);

    useEffect(() => {
        const articleElement = document.querySelector("article");
        const contentDiv = document.getElementById("main-article-content");
        if (articleElement) {
            const clonedArticle = articleElement.cloneNode(true);
            const paragraphs = clonedArticle.querySelectorAll("p");
            paragraphs.forEach((paragraph) => {
                paragraph.classList.add("origin");
            });
            contentDiv.appendChild(clonedArticle);
        } else {
            contentDiv.innerHTML = "<p>No article content found.</p>";
        }

        const handleDoubleClick = async (e) => {
            const selectedWord = window.getSelection().toString().trim();
            setWord(null)
            setDefinition(null)
            if (selectedWord && !selectedWord.includes(' ')) {
                const definition = await fetchDefinition(selectedWord);
                console.log(definition);
                setWord(selectedWord);
                setDefinition(definition[0]);
            }
        };

        document.getElementById("main-article-content").addEventListener("dblclick", handleDoubleClick);

        return () => {
            document.getElementById("main-article-content").removeEventListener("dblclick", handleDoubleClick);
        };
    }, []);

    const toggleBilingualMode = async () => {
        const newMode = !bilingualMode;
        setBilingualMode(newMode);
        const paragraphs = document.querySelectorAll("#main-article-content .origin");

        for (let paragraph of paragraphs) {
            if (!paragraph.dataset.translated) {
                const translation = await translateText(paragraph.innerText);
                const translationNode = document.createElement("p");
                translationNode.innerText = translation;
                // translationNode.style.color = "blue";
                translationNode.classList.add("translation");
                paragraph.parentNode.insertBefore(translationNode, paragraph.nextSibling);
                paragraph.dataset.translated = "true";
            }
        }

        const translationParagraphs = document.querySelectorAll("#main-article-content .translation");
        translationParagraphs.forEach((translationNode) => {
            translationNode.style.display = newMode ? "block" : "none";
        });

        const button = document.querySelector("#toggle-bilingual");
        if (newMode) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }

    };


    return (
        <div id="reader-overlay">
            <div id="main-article">
                <div id="main-article-content"></div>
            </div>
            <div id="sidebar">
                <div id="controls-section">
                    <button onClick={toggleBilingualMode} id="toggle-bilingual">
                        {bilingualMode ? "Disable Bilingual Mode" : "Enable Bilingual Mode"}
                    </button>
                </div>
                <DictWrap word={word} detail={definition} />
            </div>
            <button id="close-btn" onClick={onClose}>❌</button>
        </div>
    );
};

export default Reader;
