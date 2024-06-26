import React, { useEffect, useState } from 'react';
import { getLookingWords } from '~api/lookingWord';
import Reader from '~components/Reader';

const WordHistory = () => {
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [article, setArticle] = useState({ id: null, title: null, paragraphs: [], translations: [], looking_words:[] });
  let translations = []
  // const [selectedWordParagraph, setSelectedWordParagraph] = useState(null);

  // Retrieve words list in useEffect
  useEffect(() => {
    const init = async () => {
      const response = await getLookingWords();
      if (response.success) {
        setWords(response.data);
      }
    };
    init();
  }, []);

  const handleWordClick = (word) => {
    console.log("set word: ", word.word)
    setSelectedWord(word);
    let paragraphs = []
    paragraphs["0"] = "..."
    paragraphs[word.paragraph_id] = word.paragraph_text
    paragraphs["-"] = "..."
    const article = {
      id: word.article_id,
      title: word.article_title,
      paragraphs: paragraphs,
      looking_words: [word.word],
      translations: []
    };
    // console.log()
    setArticle(article)
    // setSelectedWordParagraph(word.paragraph_text);
  };
  return (
    <div className="flex">
      <div className="w-1/5 p-4 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Vocabulary</h2>
        <ul className="h-[80vh] space-y-2 overflow-y-scroll mandatory-snap-x">
          {words && words.length > 0 ? (
            words.map((word) => (
              <li key={word.id} onClick={() => handleWordClick(word)} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                <div className="text-sm font-semibold">{word.word}</div>
                <div className="text-xs text-gray-600">{word.created_at}</div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No words found</li>
          )}
        </ul>
      </div>
      <div className="w-4/5">
        {article ? (
          <Reader selectedArticle={article} />
        ) : (
          <div className="text-gray-500">Select an article to view its content</div>
        )}
      </div>

    </div>
  )
};

export default WordHistory;
