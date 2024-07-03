import React, { useEffect, useState } from "react";
import DictWrap from "./DictWrap";
import { fetchDefinition } from "~api/dict";
import { translateText } from "~api/translate";
import { speakText } from "~api/tts";
import Loading from "~components/Loading";
import { addArticle } from "~api/article";
import { addLookingWord, removeLookingWord } from "~api/lookingWord";
// import { useAuth } from "~contexts/AuthContext";
import { useUser } from "~contexts/UserContext";
import { cleanWord } from "~api/helper";
import "~styles/reader.css";
import LocaleSelector from "./LocaleSelector";

const Reader = ({ selectedArticle }) => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(false);
  const [bilingualMode, setBilingualMode] = useState(false);
  const [hint, setHint] = useState(true);
  const [article, setArticle] = useState({ id: null, title: null, paragraphs: [], translations: [], unfamiliar_words: [] });
  const [translating, setTranslating] = useState([]);
  const [looking, setLooking] = useState(false);
  const [highlightParagraphs, setHighlightParagraphs] = useState([]);
  const { user } = useUser();

  const [locale, setLocale] = useState(null);

  const handleSelectLocale = (selectedLocale) => {
      setLocale(selectedLocale);
  };

  useEffect(() => {
    const newArticle = { ...selectedArticle, translations: [] };
    setArticle(newArticle);

    setBilingualMode(false);

    // handle highlight paragraph
    let newParagraphs = []
    setHighlightParagraphs([])
    Object.entries(newArticle.paragraphs).map(([index, paragraph]) => {
      console.log("paragraph: ", index, paragraph);
      newParagraphs[index] = highlightText(paragraph, newArticle.unfamiliar_words)
    })
    setHighlightParagraphs(newParagraphs);
  }, [selectedArticle]);

  const updateHighlightParagraphs = (paragraphId, unfamiliar_words) => {
    // console.log("new looking words: ", newArticle.unfamiliar_words);
    let newHighlightParagraphs = { ...highlightParagraphs };
    newHighlightParagraphs[paragraphId] = highlightText(article.paragraphs[paragraphId], unfamiliar_words)
    setHighlightParagraphs(newHighlightParagraphs);
  }
  const handleDoubleClick = async (e) => {
    const select = window.getSelection().toString().trim();
    const selectedWord = cleanWord(select);
    setDefinition(null);

    const paragraphElement = e.target.closest('.paragraph');
    const paragraphId = paragraphElement.dataset.paragraphId;

    // test if the target has a class "highlight"
    if (e.target.classList.contains("highlight")) {
      removeLookingWord(selectedWord, article.id, paragraphId).then(response => {
        console.log(response)
        if (response.success) {
          updateHighlightParagraphs(paragraphId, response?.data?.article?.unfamiliar_words)
        }
      })
    }else if (selectedWord && !selectedWord.includes(' ')) {
      setLooking(true);
      const result = await fetchDefinition(selectedWord);
      setLooking(false);
      if (result && result.length > 0) {
        setDefinition(result[0]);
        setHint(false);
        if (user.id) {
          if (paragraphElement) {
            addLookingWord(selectedWord, article.id, paragraphId).then(response => {
              console.log(response)
              if (response.success) {
                const newArticle = response?.data?.article
                console.log("new looking words: ", newArticle.unfamiliar_words);
                let newHighlightParagraphs = { ...highlightParagraphs };
                newHighlightParagraphs[paragraphId] = highlightText(article.paragraphs[paragraphId], newArticle.unfamiliar_words)
                setHighlightParagraphs(newHighlightParagraphs);
              }
            })
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
      const select = e.target.innerText;
      const selectedWord = cleanWord(select)
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
    if (!newMode) return

    let newArticle = { ...article, translations: [...article.translations] };
    const paragraphs = Object.entries(article.paragraphs);
    for (const [i, text] of paragraphs) {
      if (!newArticle.translations[i]) {
        setTranslating((prev) => {
          const newTranslating = [...prev];
          newTranslating[i] = true;
          return newTranslating;
        });
        try{
          newArticle.translations[i] = await translateText(text);
        }catch(e) {
          console.log(e)
        }

        setTranslating((prev) => {
          const newTranslating = [...prev];
          newTranslating[i] = false;
          return newTranslating;
        });
        setArticle({ ...newArticle });
      }
    }
  };

  const handleTranslate = async(e) => {
    const pid = e.target.dataset.paragraphId;
    if (!pid) return;
    const text = article.paragraphs[pid];
    if (!text) return;
    
    setBilingualMode(true);

    setTranslating((prev) => {
      const newTranslating = [...prev];
      newTranslating[pid] = true;
      return newTranslating;
    });

    let newArticle = { ...article, translations: [...article.translations] };
    try{
      newArticle.translations[pid] = await translateText(text, locale.locale);
    }catch(e) {
      console.log(e)
    }

    setTranslating((prev) => {
      const newTranslating = [...prev];
      newTranslating[pid] = false;
      return newTranslating;
    });

    setArticle(newArticle)
  }

  const highlightText = (text, words_list) => {
    const words = text.split(' ');
    return words.map((text, index) => {
      const word = cleanWord(text)
      if (words_list.includes(word)) {
        return <span key={index} className="highlight" onClick={handleClick}>{text} </span>;
      }
      return text + ' ';
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
        {/* <p>{article.unfamiliar_words.map((word, index) => (
          <span key={word}>{word}, </span>
        ))}</p> */}

        <table className="min-w-full bg-white">
          <tbody>
            {highlightParagraphs && Object.entries(highlightParagraphs).map(([index, paragraph]) => (
              <tr key={index} className="paragraph" data-paragraph-id={index}>
                <td className="relative">
                  <p onDoubleClick={handleDoubleClick}>{paragraph}</p>
                  {bilingualMode && article.translations[index] &&
                    <p className={`text-blue-600 bg-gray-100 animate-slideDown`}>
                      {article.translations[index]}
                    </p>
                  }
                  {bilingualMode && translating[index] && <Loading />}
                </td>
                <td>
                  <span className="speaker-icon" data-paragraph-id={index} onClick={handleClick}>🔊</span>
                  <span className="translate-icon" data-paragraph-id={index} onClick={handleTranslate}>🌐</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div id="sidebar" className="w-3/10 p-4">
      {/* <div id="controls-section" className="flex items-center space-x-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            checked={bilingualMode}
            className="sr-only peer"
            onChange={toggleBilingualMode}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Bilingual Mode</span>
        </label>
      </div>
      <hr className="my-2" /> */}
      <div>
        Native Language: <LocaleSelector onSelectLocale={handleSelectLocale} />
      </div>
      {hint &&
        <div className="mt-2 bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500" role="alert">
          <span className="font-bold">Info</span> Double-click any word in the article to see its definition and details here.
        </div>
      }
      {looking && <div className="mt-20 relative" ><Loading /></div>}
      {!hint && !looking && !definition &&
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
