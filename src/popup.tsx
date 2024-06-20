import { useState } from "react"
import "~styles/tailwind.css"

function IndexPopup() {
  const [data, setData] = useState("")

const toggleReaderMode = () => {
  console.log("Sending toggleReaderMode message");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("open reader mode to tab: ", tabs[0].id)
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-reader-mode' });
  });
};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "15em"
      }}>
      <button onClick={toggleReaderMode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Reader Mode</button>
    </div>
  )
}

export default IndexPopup
