import React, { useEffect, useState } from "react";
import DictWrap from "./DictWrap";
import { fetchDefinition } from "~api/dict";
import { translateText } from "~api/translate";
import { speakText } from "~api/tts";
import Loading from "~components/Loading";
import { addArticle } from "~api/article";
import { addLookingWord } from "~api/lookingWord";
import { useAuth } from "~contexts/AuthContext";
import "~styles/reader.css";
import "~styles/tailwind.css";

const Reader = ({ selectedArticle }) => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(false);
  const [bilingualMode, setBilingualMode] = useState(false);
  const [hint, setHint] = useState(true);
  const [article, setArticle] = useState({ id: null, title: null, paragraphs: [], translations: [], looking_words: [] });
  const [translating, setTranslating] = useState([]);
  const [looking, setLooking] = useState(false);
  const [highlightParagraphs, setHighlightParagraphs] = useState([]);
  const { email } = useAuth();

  useEffect(() => {
    const newArticle = { ...selectedArticle, translations: [] };
    setArticle(newArticle);

    // handle highlight paragraph
    let newParagraphs = []
    setHighlightParagraphs([])
    Object.entries(newArticle.paragraphs).map(([index, paragraph]) => {
      console.log("paragraph: ", index, paragraph);
      newParagraphs[index] = highlightText(paragraph, newArticle.looking_words)
    })
    setHighlightParagraphs(newParagraphs);
  }, [selectedArticle]);

  const handleDoubleClick = async (e) => {
    const selectedWord = window.getSelection().toString().trim();
    setDefinition(null);
    if (selectedWord && !selectedWord.includes(' ')) {
      setLooking(true);
      const result = await fetchDefinition(selectedWord);
      setLooking(false);
      if (result && result.length > 0) {
        setDefinition(result[0]);
        setHint(false);
        console.log("result: ", result[0]);
        console.log("email: ", email)
        if (email) {
          const paragraphElement = e.target.closest('.paragraph');
          if (paragraphElement) {
            const paragraphId = paragraphElement.dataset.paragraphId;
            const response = await addLookingWord(selectedWord, article.id, paragraphId);
            console.log(response)
            if (response.success) {
              const newArticle = response?.data?.article
              console.log("new looking words: ", newArticle.looking_words);
              let newParagraphs = []
              Object.entries(article.paragraphs).map(([index, paragraph]) => {
                // console.log("paragraph: ", index, paragraph);
                newParagraphs[index] = highlightText(paragraph, newArticle.looking_words)
              })
              setHighlightParagraphs(newParagraphs);
            }
          }
        }
      }
    }
  };
  const handleClick = async (e) => {
    if (e.target.classList.contains("speaker-icon")) {
      const paragraphElement = e.target.closest('.paragraph');
      const pid = paragraphElement ? paragraphElement.dataset.paragraphId : null;
      const paragraphText = pid !== null ? article.paragraphs[pid] : null;
      if (paragraphText) speakText(paragraphText);
    } else if (e.target.classList.contains("highlight")) {
      const selectedWord = e.target.innerText;
      const result = await fetchDefinition(selectedWord);
      if (result && result.length > 0) {
        setDefinition(result[0]);
        setLooking(false);
        setHint(false);
      }
    }
  };
  const toggleBilingualMode = async () => {
    if (!article || !article.paragraphs) return;

    const newMode = !bilingualMode;
    setBilingualMode(newMode);

    let newArticle = { ...article, translations: [...article.translations] };
    const paragraphs = Object.entries(article.paragraphs);
    for (const [i, text] of paragraphs) {
      if (!newArticle.translations[i]) {
        setTranslating((prev) => {
          const newTranslating = [...prev];
          newTranslating[i] = true;
          return newTranslating;
        });
        newArticle.translations[i] = await translateText(text);
        setTranslating((prev) => {
          const newTranslating = [...prev];
          newTranslating[i] = false;
          return newTranslating;
        });
        setArticle({ ...newArticle });
      }
    }
  };

  const highlightText = (text, words_list) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
      if (words_list.includes(cleanWord)) {
        return <span key={index} className="highlight" onClick={handleClick}>{word} </span>;
      }
      return word + ' ';
    });
  };

  const readArticle = () => {
    const articleText = Object.values(article.paragraphs).join("\n");
    speakText(articleText);
  };

  return (<div id="reader-wrap" className="flex flex-row w-full h-full">
    <div id="main-article" className="w-7/10 p-4">
      <div className="prose prose-lg mx-auto my-2 p-2 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 mr-2">{article.title}

          <button onClick={readArticle} className="ml-2 text-sm text-blue-600 font-bold py-2 px-4 rounded-md">
            Speech 🔊
          </button>
        </h1>
        {/* <p>{article.looking_words.map((word, index) => (
          <span key={word}>{word}, </span>
        ))}</p> */}

        <table className="min-w-full bg-white">
          <tbody>
            {highlightParagraphs && Object.entries(highlightParagraphs).map(([index, paragraph]) => (
              <tr key={index} className="paragraph" data-paragraph-id={index}>
                <td className="relative">
                  <p onDoubleClick={handleDoubleClick}>{paragraph}</p>
                  {bilingualMode && article.translations[index] &&
                    <p className={`mb-4 text-blue-600 bg-gray-100 p-3 rounded animate-slideDown`}>
                      {article.translations[index]}
                    </p>
                  }
                  {bilingualMode && translating[index] && <Loading />}
                </td>
                <td><span className="speaker-icon" data-paragraph-id={index} onClick={handleClick}>🔊</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div id="sidebar" className="w-3/10 p-4">
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
      {looking && <div className="mt-20 relative" ><Loading /></div>}
      {!looking && !definition &&
        <div className="mt-2 bg-red-100 border border-red-200 text-sm text-gray-800 rounded-lg p-4 dark:bg-gray-800/10 dark:border-gray-900 dark:text-blue-500" role="alert">
          <span className="font-bold">Error</span> Sorry pal, we couldn't find definitions for the word you were looking for.
        </div>
      }
      {<DictWrap detail={definition} />}
    </div>
  </div>
  );
};

export default Reader;
