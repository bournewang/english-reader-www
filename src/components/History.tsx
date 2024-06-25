import React, { useEffect, useState } from 'react';
import { getArticles } from '~api/article';
import Reader from '~components/Reader';

const History = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Retrieve articles list in useEffect
  useEffect(() => {
    const init = async () => {
      const response = await getArticles();
      if (response.success) {
        setArticles(response.data);
      }
    };
    init();
  }, []);

  const handleArticleClick = (article) => {
    console.log("set article: ", article.title)
    setSelectedArticle(article);
  };

  return (
    <div className="flex">
      <div className="w-1/5 p-4 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Articles</h2>
        {/* add tailwind style to make ul scroll in height, set its height to 100% and set its overflow to auto. See https://tailwindcss.com/docs/scroll-snap-scroll-snap-x-y#scroll-snap-properties for more info.  */}
        <ul className="space-y-2 scroll-y-scroll overflow-y-scroll scroll-snap-y-mandatory scroll-snap-align-start scroll-snap-type-y mandatory-snap-x">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <li key={article.id} onClick={() => handleArticleClick(article)} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                <div className="text-sm font-semibold">{article.title}</div>
                <div className="text-xs text-gray-600">Word Count: {article.word_count}</div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No articles found</li>
          )}
        </ul>
      </div>
      <div className="w-4/5">
        {selectedArticle ? (
            <Reader selectedArticle={selectedArticle}/>
        ) : (
          <div className="text-gray-500">Select an article to view its content</div>
        )}
      </div>
    </div>
  );
};

export default History;
