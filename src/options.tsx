import React, { useState } from 'react';
import Login from '~components/Login'
import Dashboard from '~components/Dashboard';
import History from '~components/History';
import Page2 from '~Page2';
import Page3 from '~Page3';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/tailwind.css'; // Ensure Tailwind CSS is imported

function OptionsPage() {
  const [path, setPath] = useState<string>('');
  const { email } = useAuth();

  const toggle = (newPath: string) => {
    console.log('toggle');
    setPath(newPath);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl">Welcome to My App,  email: {email}</h1>
        </header>
        {!email ? (
          <div className="flex-1 flex items-center justify-center">
            <Login />
          </div>
        ) : (
          <div className="flex-1 flex">
            <nav className="bg-blue-600 w-1/8 p-4">
              <h1 className="text-white text-2xl mb-4">My App</h1>
              <ul className="space-y-2">
                <li><button onClick={() => toggle("/my")} className="text-white hover:text-gray-300 w-full text-left">Dashboard</button></li>
                <li><button onClick={() => toggle("/history")} className="text-white hover:text-gray-300 w-full text-left">History</button></li>
                <li><button onClick={() => toggle("/page2")} className="text-white hover:text-gray-300 w-full text-left">Page 2</button></li>
                <li><button onClick={() => toggle("/page3")} className="text-white hover:text-gray-300 w-full text-left">Page 3</button></li>
              </ul>
            </nav>
            <div className="flex-1">
              <main className="p-2">
                {path === "/my" && <Dashboard />}
                {path === "/history" && <History />}
                {path === "/page2" && <Page2 />}
                {path === "/page3" && <Page3 />}
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
// const container = document.getElementById('root');
// const root = createRoot(container!);
// root.render(
//   <AuthProvider>
//     <OptionsPage />
//   </AuthProvider>
// );

export default options;
