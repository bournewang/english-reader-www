import React, { useEffect, useState, useContext } from "react";
import DictWrap from "./DictWrap";
import { fetchDefinition } from "~api/dict";
import { translateText } from "~api/translate";
import { speakText } from "~api/tts"
import "~styles/overlay.css"
import "~styles/tailwind.css"

const Reader = ({ onClose }) => {
    const [word, setWord] = useState(false);
    const [definition, setDefinition] = useState(false);
    const [bilingualMode, setBilingualMode] = useState(false);
    const [hint, setHint] = useState(true)
    //   const shadowRoot = useContext(ShadowRootContext);

    useEffect(() => {
        const articleElement = document.querySelector("article");
        const contentDiv = document.getElementById("main-article-content");
        if (!contentDiv) return

        if (articleElement) {
            const clonedArticle = articleElement.cloneNode(true);
            const paragraphs = clonedArticle.querySelectorAll("p");
            paragraphs.forEach((paragraph) => {
                paragraph.classList.add("origin");
                const speakerIcon = document.createElement("span");
                speakerIcon.innerText = "🔊";
                speakerIcon.className = "speaker-icon";
                speakerIcon.style.cursor = "pointer";
                speakerIcon.style.marginLeft = "10px";
                paragraph.appendChild(speakerIcon);

            });
            if (contentDiv)
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
                setHint(false)
            }
        };

        const handleClick = (e) => {
            if (e.target.classList.contains("speaker-icon")) {
                const paragraph = e.target.parentElement;
                const paragraphText = paragraph.innerText.replace(e.target.innerText, ''); // Exclude the speaker icon text
                speakText(paragraphText)
            }
        };

        document.getElementById("main-article-content").addEventListener("dblclick", handleDoubleClick);
        document.getElementById("main-article-content").addEventListener("click", handleClick);

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
                const paragraphText = paragraph.innerText.replace('🔊', '');
                const translation = await translateText(paragraphText);
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
    };

    const readArticle = () => {
        const articleText = Array.from(document.querySelectorAll("#main-article-content .origin"))
            .map(paragraph => paragraph.innerText)
            .join(" ");
        speakText(articleText.replaceAll('🔊', ''));
        // window.speechSynthesis.speak(speech);
    };

    return (
        <div id="reader-overlay">
            <div id="main-article">
                <div id="main-article-content"></div>
            </div>
            <div id="sidebar">
                <div id="controls-section" className="flex items-center space-x-4">
                    <button onClick={readArticle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Read Article 🔊
                    </button>

                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            onChange={toggleBilingualMode}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Bilingual Mode</span>
                    </label>                   
                </div>
                <hr />
                { hint && 
                <div className="mt-2 bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500" role="alert">
                    <span className="font-bold">Info</span> Double-click any word in the article to see its definition and details here.
                    </div>}
                <DictWrap word={word} detail={definition} />
            </div>
            <button id="close-btn" onClick={onClose}>❌</button>
        </div>
    );
};

export default Reader;
