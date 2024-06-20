import { useState } from "react"

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
        width: "100px"
      }}>
      {/* <h1>English Reader</h1> */}
      <button onClick={toggleReaderMode}>Open Reader Mode</button>
      {/* <footer>Crafted by @PlasmoHQ</footer> */}
    </div>
  )
}

export default IndexPopup
