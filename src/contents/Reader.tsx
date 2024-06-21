import React, { useEffect, useState } from "react";
import DictWrap from "./DictWrap";
import { fetchDefinition } from "~api/dict";
import { translateText } from "~api/translate";
import { speakText } from "~api/tts"
import { fetchMainArticleContent } from "~api/helper";
import Loading from "./Loading";
import "~styles/overlay.css"
import "~styles/tailwind.css"

const Reader = ({ onClose }) => {
    const [word, setWord] = useState("");
    const [definition, setDefinition] = useState(false);
    const [bilingualMode, setBilingualMode] = useState(false);
    const [hint, setHint] = useState(true)
    const [article, setArticle] = useState({ title: null, paragraphs: [], translations: [] })
    const [translating, setTranslating] = useState([])
    const [looking, setLooking] = useState(false)

    useEffect(() => {
        const articleContent = fetchMainArticleContent()
        setArticle(articleContent)
        const contentDiv = document.getElementById("main-article-content");
        if (!contentDiv) return

        const handleDoubleClick = async (e) => {
            const selectedWord = window.getSelection().toString().trim();
            setDefinition(null)
            if (selectedWord && !selectedWord.includes(' ')) {
                setLooking(true)
                const result = await fetchDefinition(selectedWord);
                if (result && result.length > 0) {
                    setDefinition(result[0]);
                    setLooking(false)
                    setHint(false)
                }
            }
        };

        const handleClick = (e) => {
            if (e.target.classList.contains("speaker-icon")) {
                const paragraph = e.target.parentElement;
                const paragraphText = paragraph.innerText.replace(e.target.innerText, ''); // Exclude the speaker icon text
                speakText(paragraphText)
            }
        };

        contentDiv.addEventListener("dblclick", handleDoubleClick);
        contentDiv.addEventListener("click", handleClick);

        return () => {
        };
    }, []);

    const toggleBilingualMode = async () => {
        if (!article || !article.paragraphs) return;

        const newMode = !bilingualMode;
        setBilingualMode(newMode);

        let newArticle = { ...article, translations: [...article.translations] };

        for (let i = 0; i < article.paragraphs.length; i++) {
            if (!newArticle.translations[i]) {
                translating[i] = true
                setTranslating(translating);
                newArticle.translations[i] = await translateText(article.paragraphs[i]);

                translating[i] = false
                setArticle(newArticle);
                setTranslating(translating);
                newArticle = { ...newArticle };
            }
        }
    };

    const readArticle = () => {
        const articleText = article.paragraphs.join("\n")
        speakText(articleText.replaceAll('🔊', ''));
    };

    return (
        <div id="reader-overlay">
            <div id="main-article">
                <div id="main-article-content">
                    <div className="flex flex-row-reverse">
                        <button onClick={readArticle} className="fixed text-sm bg-blue-500 hover:bg-blue-700 text-xs text-white font-bold py-2 px-4 rounded-md">
                            Read Article 🔊
                        </button>
                    </div>
                    <div className="prose prose-lg mx-auto my-2 p-6 bg-white rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-4">{article.title} </h1>
                        {/* <p className="text-gray-700 mb-4"></p> */}
                        {article && article.paragraphs && article.paragraphs.map((paragraph, index) => (
                            <div key={index}>
                                {/* origin paragraph */}
                                <p className="mb-4 text-gray-800 origin">
                                    {paragraph}<span className="speaker-icon">🔊</span>
                                </p>

                                {/* loading */}
                                {bilingualMode && translating[index] &&
                                    <Loading />
                                }

                                {/* translation */}
                                {bilingualMode && article.translations[index] &&
                                    <p className={`mb-4 text-blue-600 bg-gray-100 p-3 rounded animate-slideDown`}>
                                        {article.translations[index]}
                                    </p>
                                }

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div id="sidebar">
                <div id="controls-section" className="flex items-center space-x-4">
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
                <hr className="my-2" />
                {hint &&
                    <div className="mt-2 bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500" role="alert">
                        <span className="font-bold">Info</span> Double-click any word in the article to see its definition and details here.
                    </div>
                }

                {looking && <div className="mt-20"><Loading /></div>}

                <DictWrap detail={definition} />
            </div>
            <button id="close-btn" onClick={onClose}>❌</button>
        </div>
    );
};

export default Reader;
