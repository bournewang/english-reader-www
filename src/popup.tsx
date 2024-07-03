import {useState} from 'react';
// import IndexPopup from './IndexPopup';
// import { AuthProvider } from '~contexts/AuthContext';
import { UserProvider } from "~contexts/UserContext";
import "~styles/tailwind.css"
// import React from 'react';
// import { useAuth } from './contexts/AuthContext';
import { useUser } from '~contexts/UserContext';
import { logoutUser } from '~api/user';

function IndexPopup() {
  //   const { email, setEmail, isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  // const { email, setEmail } = useAuth()
  const {user} = useUser();
  const [env] = useState(process.env.NODE_ENV);

  const toggleReaderMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggle-reader-mode' });
    });
  };

  const openLoginPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  return (
    <div className="flex flex-col p-4 w-80 bg-gray-100 rounded-lg shadow-md">
      {user && (
        <div className="flex justify-end items-center mb-4 space-x-4">
          <p className="mt-2 text-blue-500 hover:text-blue-700 font-bold cursor-pointer ">{user.email}</p>
          <p
            onClick={logoutUser}
            className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
          >
            Logout
          </p>
        </div>
      )}
      <button
        onClick={toggleReaderMode}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
      >
        Reader Mode
      </button>

      <button
        onClick={openLoginPage}
        //   className="text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        {user ? "History" : ("Login / Register")}
      </button>

      <p>{env}</p>

    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <IndexPopup />
    </UserProvider>
  );
}

export default App;