import React from "react"

import type { Definition, Phonetic, Meaning, DictDetail } from "~api/dict"

const DictPanel: React.FC<{detail: DictDetail}> = ({ detail }) => {
  return (
    detail && <div id="details-section">
      <h2>{detail.word}</h2>
      <div className="phonetics">
        {detail.phonetics && detail.phonetics.length > 0 && detail.phonetics.map((phonetic: Phonetic, index) => (
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
                  <p className="example">
                    <span className="speaker-icon" data-example-index={definitionIndex}>🔊</span>
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
