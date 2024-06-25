import React from "react"
import { createRoot } from "react-dom/client"
import Reader from "~components/Reader"
// import Reader from "./Reader"
import Register from "~components/Register"
import { fetchMainArticleContent } from "~api/helper"
import { getArticle } from "~api/article"
// import "../styles/overlay.css"

const createReader = async() => {
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

        // const article = fetchMainArticleContent()
        const response = await getArticle(9)
        const article = response.data
        console.log(article)

        const root = createRoot(overlay)
        root.render(
            // <Register/>
            <Reader 
                selectedArticle={article} 
                // onClose={hideReader} 
                />
            )
        return
    }

    overlay.style.display = overlay.style.display == 'none' ? "block" : 'none'
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle-reader-mode") {
        createReader()
    }
})
