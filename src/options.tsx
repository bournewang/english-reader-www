import React, { useState } from 'react';
import Header from '~components/Header';
import Login from '~components/Login'
import Dashboard from '~components/Dashboard';
import History from '~components/History';
import WordHistory from '~components/WordHistory';
// import Page3 from '~Page3';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/tailwind.css'; // Ensure Tailwind CSS is imported
import { logoutUser } from '~api/user';

function OptionsPage() {
  const [path, setPath] = useState<string>('');
  const { email } = useAuth();
  const [menuMode, setMenuMode] = useState("headerMode"); // set to headerMode or not

  const toggle = (newPath: string) => {
    console.log('toggle');
    setPath(newPath);
  };

  const handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  };

  return (
    <>
      {/* set the layout take 100% of width and height, donot scroll */}
      <div className="min-h-screen flex flex-col bg-gray-100 w-full h-full">
        {/* <Header email={email} /> */}
        <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
          {menuMode == 'headerMode' && (
            <nav className="space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/my")} >           Home</a>
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/history")}>       Articles</a>
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/word-history")} > Vocabulary</a>
            </nav>
          )}
          <h1 className="text-white text-lg font-semibold">English Reader</h1>

          <div className="space-x-2">
            {email && (
              <>
                <span className="text-white ">{email}</span>
                <button className="text-white ml-4" onClick={handleLogout}>Logout</button>
              </>
            )
            }
          </div>
        </header>

        {!email ? (
          <div className="flex-1 flex items-center justify-center">
            <Login />
          </div>
        ) : (
          <div className="flex-1 flex">
            {menuMode != "headerMode" && (
              <nav className="bg-blue-600 w-1/8 p-4">
                {/* <h1 className="text-white text-2xl mb-4">My App</h1> */}
                <ul className="space-y-2">
                  <li><button onClick={() => toggle("/my")} className="text-white hover:text-gray-300 w-full text-left">Dashboard</button></li>
                  <li><button onClick={() => toggle("/history")} className="text-white hover:text-gray-300 w-full text-left">Article History</button></li>
                  <li><button onClick={() => toggle("/word-history")} className="text-white hover:text-gray-300 w-full text-left">Vocabulary</button></li>
                </ul>
              </nav>
            )}
            <div className="flex-1">
              <main className="p-2">
                {path === "/my" && <Dashboard />}
                {path === "/history" && <History />}
                {path === "/word-history" && <WordHistory />}
                {/* {path === "/page3" && <Page3 />} */}
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


function options() {
  return (
    <AuthProvider>
      <OptionsPage />
    </AuthProvider>
  );
}

export default options;
