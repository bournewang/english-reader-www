import React, { useEffect, useState } from "react";
import DictPanel from "./DictPanel";
import { fetchDefinition } from "~api/dict";
import { translateText } from "~api/translate";
import type { Article } from "~api/article";
import { speakText } from "~api/tts";
import Loading from "~components/Loading";
import { addLookingWord, removeLookingWord } from "~api/lookingWord";
import { useUser } from "~contexts/UserContext";
import { cleanWord } from "~api/helper";
import "~styles/reader.css";
import { useLocale } from "~contexts/LocaleContext";

interface ReaderProps {
  selectedArticle: Article;
}

const Reader: React.FC<ReaderProps> = ({ selectedArticle }) => {
  const [definition, setDefinition] = useState(null);
  const [bilingualMode, setBilingualMode] = useState(false);
  const [hint, setHint] = useState(true);
  const [article, setArticle] = useState<Article>({} as Article);
  const [translating, setTranslating] = useState([]);
  const [looking, setLooking] = useState(false);
  const [highlightParagraphs, setHighlightParagraphs] = useState([]);
  const { locale } = useLocale();
  // const [locale] = useState({ locale: "zh-CN" });
  const { user } = useUser();

  useEffect(() => {
    console.log("in reader: ")
    console.log(selectedArticle);
    const newArticle = { ...selectedArticle, translations: [] };
    setArticle(newArticle);

    setBilingualMode(false);

    // handle highlight paragraph
    const newParagraphs = []
    setHighlightParagraphs([])
    newArticle.paragraphs && Object.entries(newArticle.paragraphs).map(([index, paragraph]) => {
      console.log("paragraph: ", index, paragraph);
      newParagraphs[index] = highlightText(paragraph, newArticle.unfamiliar_words)
    })
    setHighlightParagraphs(newParagraphs);
  }, [selectedArticle]);

  const updateHighlightParagraphs = (paragraphId, unfamiliar_words) => {
    // console.log("new looking words: ", newArticle.unfamiliar_words);
    const newHighlightParagraphs = { ...highlightParagraphs };
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
    } else if (selectedWord && !selectedWord.includes(' ')) {
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
                const newHighlightParagraphs = { ...highlightParagraphs };
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
    if (e.target.classList.contains("speaker-btn")) {
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

  const handleTranslate = async (e) => {
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

    const newArticle = { ...article, translations: [...article.translations] };
    try {
      console.log("locale: ", locale);
      newArticle.translations[pid] = await translateText(text, locale?.locale);
    } catch (e) {
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
        return <span key={index} className="highlight bg-green-300 cursor-pointer" onClick={handleClick}>{text} </span>;
      }
      return text + ' ';
    });
  };

  const readArticle = () => {
    const articleText = Object.values(article.paragraphs).join("\n");
    speakText(articleText);
  };

  return (article && <div id="reader-wrap1" className="flex w-full h-[90vh] overflow-y-scroll">
      <div id="main-article" className="bg-white shadow-lg rounded-lg overflow-y-auto" style={{ width: '70%' }}>
        <div className="prose-lg mx-2 p-2 max-w-full " style={{ maxWidth: '100%' }}>
          <h1 className="text-3xl font-bold mb-4 mr-2">{article.title}

            <button onClick={readArticle} className="ml-2 text-sm text-blue-600 font-bold py-2 px-4 rounded-md">
              Speech 🔊
            </button>
          </h1>
          <p>locale: {locale?.locale} {locale?.country}</p>
          {/* <p>{article.unfamiliar_words.map((word, index) => (
          <span key={word}>{word}, </span>
        ))}</p> */}

          <table className="min-w-full">
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
                    <p className="speaker-btn cursor-pointer" data-paragraph-id={index} onClick={handleClick}>🔊</p>
                    <p className="translate-icon cursor-pointer" data-paragraph-id={index} onClick={handleTranslate}>🌐</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="sidebar1" className="bg-white mx-2 p-2 shadow-lg rounded-lg overflow-y-auto" style={{ width: '30%' }}>
        <div id="controls-section" className="flex items-center space-x-4">
        </div>
        {/* <hr className="my-2" /> */}
        {hint &&
          <div className="mt-2 bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500" role="alert">
            <span className="font-bold">Info</span> Double-click any word in the article to see its definition and details here.
          </div>
        }
        {looking && <div className="mt-20 relative" ><Loading /></div>}
        {!hint && !looking && !definition &&
          <div className="mt-2 bg-red-100 border border-red-200 text-sm text-gray-800 rounded-lg p-4 dark:bg-gray-800/10 dark:border-gray-900 dark:text-blue-500" role="alert">
            <span className="font-bold">Error</span> Sorry pal, we couldnot find definitions for the word you were looking for.
          </div>
        }
        {<DictPanel detail={definition} />}
      </div>
    </div>
  );
};

export default Reader;
