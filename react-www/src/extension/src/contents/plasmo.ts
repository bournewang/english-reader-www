import type { PlasmoCSConfig } from "plasmo"
// import type { PlasmoCSUIProps } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

window.addEventListener("load", () => {
  console.log("content script loaded")

  // document.body.style.background = "pink"
})
