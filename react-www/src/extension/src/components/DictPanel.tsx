import React, { useState } from "react"
import type { Definition, Phonetic, Meaning, DictDetail } from "~api/dict"
import { speakText } from "~api/tts";

const DictPanel = ({ detail }) => {
  const playPhoneticAudio = (event) => {
    const audio = event.target.nextElementSibling;
    if (audio && audio.tagName === "AUDIO") {
      audio.play();
    }
  }
  const speechExample = (event) => {
    const paragraph = event.target.parentElement;
    const paragraphText = paragraph.innerText.replace(event.target.innerText, ''); // Exclude the speaker icon text
    speakText(paragraphText)
  }
  return (
    detail && <div id="details-section">
      <h2 className="text-lg font-bold text-blue-600">{detail.word}</h2>
      <div className="phonetics flex space-x-2 text-base">
        {detail.phonetics && detail.phonetics.length > 0 && detail.phonetics.map((phonetic: Phonetic, index) => (
          <p key={index}>
            {phonetic.text}
            {phonetic.audio && (
              <>
                <span className=" cursor-pointer" data-audio-url={phonetic.audio} onClick={playPhoneticAudio}>🔊</span>
                <audio className="hidden-audio" src={phonetic.audio} />
              </>
            )}
          </p>
        ))}
      </div>
      {detail.meanings && detail.meanings.length > 0 && detail.meanings.map((meaning: Meaning, meaningIndex) => (
        <div className="meaning" key={meaningIndex}>
          <p className="partOfSpeech">{meaning.partOfSpeech}: {detail.word}</p>
          <ol>
            {meaning.definitions.map((definition: Definition, definitionIndex) => (
              <li key={definitionIndex}>
                {definition.definition}
                {definition.synonyms && definition.synonyms.length > 0 && (
                  <p><strong>synonyms:</strong> {definition.synonyms.join(', ')}</p>
                )}
                {definition.example && (
                  <p className="italic text-green-600 ">
                    <span className="cursor-pointer" data-example-index={definitionIndex} onClick={speechExample}>🔊</span>
                    {definition.example}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))
      }
      {detail.sourceUrls && detail.sourceUrls.length > 0 && (
        <div className="sourceUrl">
          <strong>Source:</strong>
          <ul>
            {detail.sourceUrls.map((url, urlIndex) => (
              <li key={urlIndex}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DictPanel
