import React from 'react';
import LocaleSelector from './LocaleSelector';

const Settings = () => {

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <LocaleSelector />
        </div>
      </div>
    </>
  );
};

export default Settings;
