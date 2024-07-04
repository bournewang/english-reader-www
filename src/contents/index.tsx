import createReader from "../components/CreateReader";

// const createReader = () => {
// // create a div and append to body
//     const overlay = document.createElement("div");
//     overlay.id = "english-reader-overlay";
//     overlay.className = "fixed top-0 left-0 w-full h-full bg-white z-50 border border-red-500 p-5";
//     overlay.innerText = "Hello world";
//     overlay.style.position = "absolute";
//     overlay.style.left = "0";
//     overlay.style.top = "0";
//     overlay.style.background = "white";
//     overlay.style.width="100%";
//     overlay.style.height="100%";
//     document.body.appendChild(overlay);

// }
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggle-reader-mode") {
        
        // const rootElement = document.createElement("div");
        // document.body.appendChild(rootElement);
        // ReactDOM.render(<App />, rootElement);
        // console.log("toggle-reader-mode");
        createReader();
    }
});
