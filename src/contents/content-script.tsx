import React from "react"
import { createRoot } from "react-dom/client"
import Reader from "./Reader"
// import "../styles/overlay.css"

const createReader = () => {
    const overlay = document.getElementById("english-reader-overlay")
    if (!overlay) {
        const overlay = document.createElement("div")
        overlay.id = "english-reader-overlay"
        overlay.style.display = "block"
        const styles = {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: 9999,
            border: '1px solid red',
            padding: '20px'
        };

        // Apply styles
        Object.assign(overlay.style, styles);

        document.body.appendChild(overlay)

        const hideReader = () => {
            overlay.style.display = "none"
        }

        const root = createRoot(overlay)
        root.render(<Reader onClose={hideReader} />)
        return
    }

    overlay.style.display = overlay.style.display == 'none' ? "block" : 'none'
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle-reader-mode") {
        createReader()
    }
})
