export async function fetchDefinition(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error(`Error fetching definition for ${word}: ${response.statusText}`);
        return null;
    }
}


export interface License {
    name: string;
    url: string;
  }
  
  export interface Phonetic {
    text: string;
    audio: string;
    sourceUrl?: string;
    license?: License;
  }
  
  export interface Definition {
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
  }
  
  export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
    antonyms: string[];
  }
  
  export interface DictDetail {
    word: string;
    phonetic: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    license: License;
    sourceUrls: string[];
  }
  