import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
      <button
        className="text-gray-400 hover:text-gray-200 focus:outline-none"
        onClick={toggleSidebar}
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          {/* Menu icon */}
        </svg>
      </button>
      <h1 className="text-white text-lg font-semibold">English Reader Options</h1>
    </header>
  );
};

export default Header;