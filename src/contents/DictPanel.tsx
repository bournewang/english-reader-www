import React, { useState } from "react"

const DictPanel = ({ word, detail }) => {
  return (
    <div id="details-section">
      <h2>{word}</h2>
      <div className="phonetics">
        {detail && detail.phonetics && detail.phonetics.length > 0 && detail.phonetics.map((phonetic, index) => (
          <p key={index}>
            {phonetic.text}
            {phonetic.audio && (
              <>
                <span className="phonetic-speaker-icon" data-audio-url={phonetic.audio}>🔊</span>
                <audio className="hidden-audio" src={phonetic.audio} />
              </>
            )}
          </p>
        ))}
      </div>
      {detail && detail.meanings && detail.meanings.length > 0 && detail.meanings.map((meaning, meaningIndex) => (
        <div className="meaning" key={meaningIndex}>
          <p className="partOfSpeech">{meaning.partOfSpeech}: {word}</p>
          <ol>
            {meaning.definitions.map((definition, definitionIndex) => (
              <li key={definitionIndex}>
                {definition.definition}
                {definition.synonyms && definition.synonyms.length > 0 && (
                  <p><strong>synonyms:</strong> {definition.synonyms.join(', ')}</p>
                )}
                {definition.example && (
                  <p className="example">
                    <button className="example-speech-button" data-example-index={definitionIndex}>🔊</button>
                    {definition.example}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))
      }
      {detail && detail.sourceUrls && detail.sourceUrls.length > 0 && (
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
