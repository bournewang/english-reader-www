// Create a cache object
const translationCache = {};

export async function translateText(text, targetLang = 'zh-CN') {
    // Check if the translation is already in the cache
    const cacheKey = `${text}-${targetLang}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }
    const subscriptionKey = process.env.PLASMO_PUBLIC_TRANSLATE_API_KEY; // Replace with your subscription key
    const location = process.env.PLASMO_PUBLIC_TRANSLATE_LOCATION; // Replace with your resource location
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

    const url = `${endpoint}&to=${targetLang}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify([{ Text: text }]),
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const translatedText = data[0].translations[0].text;

        // Store the translation in the cache
        translationCache[cacheKey] = translatedText;

        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}