import { stat } from 'fs';
import React, { useEffect, useState } from 'react';
import { getStats } from '~api/stats'; // You need to implement this API call

const Grid = ({ label, data, delta }) => {
  return (
    <div className="p-5 bg-white rounded shadow-sm">
      <div className="text-base text-gray-400 ">{label}</div>

      <div className="flex items-center pt-5">
        <div className="text-2xl font-bold text-gray-900 ">{data}</div>
        <span className={`ml-4 flex items-center px-2 py-0.5 mx-2 text-sm rounded-full ${delta > 0 ? 'text-green-600 bg-green-100 ' : 'text-red-600 bg-red-100 '}`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={`${delta > 0 ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"}`} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span>{delta > 0 ? delta : delta * -1}%</span>
        </span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      getStats().then(response => {
        console.log("response: ", response)
        if (response.success) {
          console.log(response.data);
          setStats(response.data);
        }
      })
    };

    fetchStats();
  }, []);

  return (
    <div className="flex items-center max-h-screen min-w-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-6xl px-5 mx-auto my-28">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <Grid label="Word Count / Today" data={stats.today_word_count} delta={stats.today_word_count_change} />
          <Grid label="Word Count / Week" data={stats.week_word_count} delta={stats.week_word_count_change} />
          <Grid label="Word Count / Month" data={stats.month_word_count} delta={stats.month_word_count_change} />
          <Grid label="Word Count / Total" data={stats.total_word_count} delta={stats.total_word_count_change} />

          <Grid label="Unfamiliar Words / Today" data={stats.today_words} delta={stats.today_words_change} />
          <Grid label="Unfamiliar Words / Week" data={stats.week_words} delta={stats.week_words_change} />
          <Grid label="Unfamiliar Words / Month" data={stats.month_words} delta={stats.month_words_change} />
          <Grid label="Unfamiliar Words / Total" data={stats.total_words} delta={stats.total_words_change} />

          <Grid label="Articles Read / Today" data={stats.today_articles} delta={stats.today_articles_change} />
          <Grid label="Articles Read / Week" data={stats.week_articles} delta={stats.week_articles_change} />
          <Grid label="Articles Read / Month" data={stats.month_articles} delta={stats.month_articles_change} />
          <Grid label="Articles Read / Total" data={stats.total_articles} delta={stats.total_articles_change} />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
