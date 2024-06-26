import React from 'react';
import { logoutUser } from '~api/user';
import { AuthProvider, useAuth } from '~contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const handleLogout = async () => {
  await logoutUser();
  window.location.reload();
};

const Header = ({ email, toggleSidebar }) => {
  return (
    <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
      <button
        className="text-gray-400 hover:text-gray-200 focus:outline-none"
        onClick={toggleSidebar}
      >
        English Reader
      </button>
      <h1 className="text-white text-lg font-semibold">English Reader Options</h1>

      {/* add some style to login user name */}
      
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
  );
};

const HeaderApp = ({}) => {
  const { email } = useAuth();
  return (
    <AuthProvider>
      <Header email={email} />
    </AuthProvider>
  );
};

export default HeaderApp;