import React from "react";

const Faq = () =>{
    return (
        <>
    <main className="container mx-auto py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">What is English Reader?</h3>
                <p className="text-gray-500 text-lg">English Reader is a browser extension designed to help users enhance their English reading skills by providing features like bilingual mode, text-to-speech, and dictionary lookup.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">How does the bilingual mode work?</h3>
                <p className="text-gray-500 text-lg">Bilingual mode translates paragraphs in the article to your native language, allowing you to compare the original English text with the translation.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Can I use English Reader offline?</h3>
                <p className="text-gray-500 text-lg">No, English Reader requires an internet connection to fetch translations and definitions.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">What languages are supported for translation?</h3>
                <p className="text-gray-500 text-lg">English Reader supports multiple languages for translation. You can select your preferred language from the settings.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">How can I report a bug or request a feature?</h3>
                <p className="text-gray-500 text-lg">You can report bugs or request features by contacting us through the Contact page or sending an email to support@englishreader.com.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">How do I use the reader mode?</h3>
                <p className="text-gray-500 text-lg">In an English article page, click on the &quot;Reader Mode&quot; button in the extension icon to open the reader. This will provide you with enhanced reading features.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">How do I look up a word in the dictionary?</h3>
                <p className="text-gray-500 text-lg">Double click on any vocabulary word in the article, and the English Reader will look it up in the dictionary for you. The definition will be displayed on the sidebar.</p>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">How do I highlight and remove highlights on words?</h3>
                <p className="text-gray-500 text-lg">When you double click on a word, it will be highlighted for future reference. If you double click on a highlighted word, the highlight will be removed.</p>
            </div>
        </div>
    </main>    
        </>
    )
}

export default Faq;