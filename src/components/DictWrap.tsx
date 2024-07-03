import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import DictPanel from "./DictPanel";
import { speakText } from "~api/tts";

const DictWrap = ({ detail }) => {
    const sidebarRef = useRef(null);
    const shadowRootRef = useRef(null);

    useEffect(() => {
        if (sidebarRef.current && !shadowRootRef.current) {
            shadowRootRef.current = sidebarRef.current.attachShadow({ mode: "open" });

            const style = document.createElement("style");
            style.textContent = `
                #details-section {margin-top: 5px; padding: 5px; background-color: #eee;color: #000;}
                .phonetics p {margin: 5px 0;}
                .partOfSpeech {font-weight: bold;}
                .example {font-style: italic;color: darkcyan;}
                .phonetic-speaker-icon, .speaker-icon {cursor: pointer;}
                h2 {font-size: 2em; margin: 0; font-weight: bold;color: darkcyan;}
                .phonetics {display: flex;margin-top: .5em;}
                .phonetic-speaker-icon {cursor: pointer; display: inline-block; margin-left: 10px;font-size: 18px;}
                .hidden-audio {display: none;}
                ol {counter-reset: item; padding-inline-start: 10px;}
                ol li {list-style: none;}
                ol li::before {counter-increment: item; content: counter(item) ". "; font-weight: bold;}
                .sourceUrl a{color: black; text-decoration: none;}
            `;
            shadowRootRef.current.appendChild(style);

            shadowRootRef.current.addEventListener('click', function (event) {
                console.log("e target class contains phonetic-speaker-icon:  ", event.target.classList.contains('phonetic-speaker-icon'))
                if (event.target.classList.contains("phonetic-speaker-icon")) {
                    const audio = event.target.nextElementSibling;
                    if (audio && audio.tagName === "AUDIO") {
                        audio.play();
                    }
                } else if (event.target.classList.contains("speaker-icon")) {
                    const paragraph = event.target.parentElement;
                    const paragraphText = paragraph.innerText.replace(event.target.innerText, ''); // Exclude the speaker icon text
                    speakText(paragraphText)
                }
            })
        }
    }, []);

    return (
        <div ref={sidebarRef} id="">
            {shadowRootRef.current && createPortal(<DictPanel detail={detail} />, shadowRootRef.current)}
        </div>
    );
};

export default DictWrap;
