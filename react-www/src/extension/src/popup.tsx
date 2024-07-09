import React, {useState} from 'react';
import { UserProvider } from "~contexts/UserContext";
import { LocaleProvider } from "~contexts/LocaleContext";
import "~styles/tailwind.css"
import { useUser } from '~contexts/UserContext';
import LocaleSelector from '~components/LocaleSelector';

const NavItem: React.FC<{path: string, title: string}> = ({ path, title }) => {
  const openPath = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL(path) });
  };
return (
  <a
  onClick={openPath}
  className="text-center hover:bg-blue-500 text-blue-700 hover:text-white m-2 p-2 cursor-pointer rounded border bg-transparent border-blue-500 hover:border-transparent"
  //  
>
  {title}
</a>
)
}
function IndexPopup() {
  const { user } = useUser();
  const [env] = useState(process.env.NODE_ENV);

  const toggleReaderMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggle-reader-mode' });
    });
  };

  return (
    <div className="flex flex-col p-4 w-80 bg-gray-100 rounded-lg shadow-md">
      {user && (
        <div className="flex justify-end items-center m-2 space-x-4">
          <p className="mt-2 text-blue-500 hover:text-blue-700 font-bold cursor-pointer ">{user.email}</p>
          {/* <p
            onClick={handleLogout}
            className="mt-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer underline"
          >
            Logout
          </p> */}
        </div>
      )}
      <button
        onClick={toggleReaderMode}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
      >
        Reader Mode
      </button>

      <NavItem path="/options.html?page=history" title="History" />
      <NavItem path="/options.html?page=reading-resources" title="Reading Resources" />
      <NavItem path="/options.html?page=settings" title="Settings" />
      <NavItem path="/options.html?page=faq" title="FAQ" />

      {/* <div className="flex justify-center items-center">
        <LocaleSelector />
      </div> */}

      {env === "development" && <p>{env}</p>}

    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <LocaleProvider>
        <IndexPopup />
      </LocaleProvider>
    </UserProvider>
  );
}

export default App;