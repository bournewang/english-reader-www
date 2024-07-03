import React, { useState } from 'react';
import Header from '~components/Header';
import Login from '~components/Login'
import Dashboard from '~components/Dashboard';
import History from '~components/History';
import WordHistory from '~components/WordHistory';
import Plans from '~components/Plans';
import Faq from '~components/Faq';
import SubscriptionManagement from '~components/Subscription';
import ReadingResources from '~components/Resources';
// import Page3 from '~Page3';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider, useUser } from '~contexts/UserContext';
import './styles/tailwind.css'; // Ensure Tailwind CSS is imported
import { logoutUser } from '~api/user';

function OptionsPage() {
  const [path, setPath] = useState<string>('/home');
  // const { user.email } = useAuth();
  const {user, logout} = useUser();
  const [menuMode, setMenuMode] = useState("headerMode"); // set to headerMode or not

  const toggle = (newPath: string) => {
    console.log('toggle');
    setPath(newPath);
  };

  const handleLogout = async () => {
    logoutUser();
    logout();
    window.location.reload();
  };

  return (
    <>
      {/* set the layout take 100% of width and height, donot scroll */}
      <div className="min-h-screen flex flex-col bg-gray-100 w-full h-full">
        {/* <Header user.email={user.email} /> */}
        <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
          {menuMode == 'headerMode' && (
            <nav className="space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/home")} >         Dashboard</a>
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/history")}>       Articles</a>
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/word-history")} > Vocabulary</a>
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/reading-resources")} > Reading Resources</a>
              
            </nav>
          )}
          <h1 className="text-white text-lg font-semibold">English Reader</h1>

          <div className="space-x-2 flex items-center justify-between">
            <nav className="space-x-2">
            <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/faq")} > FAQ</a>
              {/* <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/plan")} > Plans</a>
              <a href="#" className="text-gray-400 hover:text-gray-200" onClick={() => toggle("/subscription")} > Subscription</a> */}
            </nav>
            {user && (
              <nav className="space-x-2">
                <a className="text-white ">{user.email}</a>
                <button className="text-white ml-4" onClick={handleLogout}>Logout</button>
              </nav>
            )}
          </div>
        </header>

        {!user || !user.id ? (
          <div className="flex-1 flex items-center justify-center">
            <Login />
          </div>
        ) : (
          <div className="flex-1 flex">
            {menuMode != "headerMode" && (
              <nav className="bg-blue-600 w-1/8 p-4">
                {/* <h1 className="text-white text-2xl mb-4">My App</h1> */}
                <ul className="space-y-2">
                  <li><button onClick={() => toggle("/home")} className="text-white hover:text-gray-300 w-full text-left">Dashboard</button></li>
                  <li><button onClick={() => toggle("/history")} className="text-white hover:text-gray-300 w-full text-left">Article History</button></li>
                  <li><button onClick={() => toggle("/word-history")} className="text-white hover:text-gray-300 w-full text-left">Vocabulary</button></li>
                  <li><button onClick={() => toggle("/plan")} className="text-white hover:text-gray-300 w-full text-left">Plans</button></li>
                  <li><button onClick={() => toggle("/subscription")} className="text-white hover:text-gray-300 w-full text-left">Subscription</button></li>
                  <li><button onClick={() => toggle("/faq")} className="text-white hover:text-gray-300 w-full text-left">FAQ</button></li>
                </ul>
              </nav>
            )}
            <div className="flex-1">
              <main className="p-2">
                {path === "/home" && <Dashboard />}
                {path === "/history" && <History />}
                {path === "/word-history" && <WordHistory />}
                {path === "/reading-resources" && <ReadingResources />}
                {path === "/plan" && <Plans />}
                {path === "/subscription" && <SubscriptionManagement />}
                {path === "/faq" && <Faq/>}
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
    <UserProvider>
      <OptionsPage />
    </UserProvider>
  );
}

export default options;
