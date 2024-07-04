// import axios, { AxiosRequestConfig } from 'axios';
import { addArticle } from './article';

export function fetchMainArticleElement() {
    // Check for common semantic tags
    const commonTags = ['article', 'main', 'section'];
    for (const tag of commonTags) {
        console.log("detech tag ", tag)
        const elements = document.getElementsByTagName(tag);
        console.log("length: ", elements.length)
        if (elements.length > 0) {
            return elements[0]; // Return the first matching element
        }
    }

    // Check for common class names
    const commonClasses = ['content', 'main', 'article', 'post'];
    for (const className of commonClasses) {
        const elements = document.getElementsByClassName(className);
        if (elements.length > 0) {
            return elements[0]; // Return the first matching element
        }
    }

    // Check for common ID names
    const commonIDs = ['content', 'main', 'article', 'post'];
    for (const id of commonIDs) {
        const element = document.getElementById(id);
        if (element) {
            return element; // Return the matching element
        }
    }

    // Check for the largest text block
    const allElements = document.body.getElementsByTagName('*');
    let largestElement = null;
    let maxTextLength = 0;
    for (const element of allElements) {
        if (element.offsetWidth > 0 && element.offsetHeight > 0) { // Only consider visible elements
            const textLength = element.textContent.length;
            if (textLength > maxTextLength) {
                maxTextLength = textLength;
                largestElement = element;
            }
        }
    }

    return largestElement; // Return the largest text block element
}


export function fetchMainArticleContent()
{
    const articleElement = fetchMainArticleElement()
    const ps = articleElement.querySelectorAll("p");
    const paragraphs = {}
    let i = 1
    ps.forEach((p) => {
        paragraphs[(i++).toString()] = p.innerText
    })

    const info = collectArticleInfo()
    return {
        ...info,
        title: document.title, 
        paragraphs, 
        translations: [], 
        unfamiliar_words: []
    }
}

export function addArticleFromDocument(){
    const article = fetchMainArticleContent()
    article.paragraphs = Object.values(article.paragraphs)
    console.log("fetch article: ")
    console.log(article)
    return addArticle(article)
}

import { api } from './api';

type RequestData = string | number | object | undefined;

export const apiRequest = async (url: string, method: 'GET' | 'POST' | 'DELETE', data?: RequestData): Promise<RequestData> => {
    try {
        const response = await api({
            method,
            url,
            data,
        });
        if (response.status !== 200 && response.status !== 201) {
            throw response;
        }
        return response.data;
    } catch (error) {
        throw error.response;
    }
};




function getMetaContentByName(name) {
    const meta = document.querySelector(`meta[name='${name}']`);
    return meta ? meta.getAttribute('content') : null;
}

function getMetaContentByProperty(property) {
    const meta = document.querySelector(`meta[property='${property}']`);
    return meta ? meta.getAttribute('content') : null;
}

export function collectArticleInfo() {
    // Collect the URL
    const url = window.location.href;

    // Collect the author (assuming it's stored in a meta tag)
    let author = getMetaContentByName('author') || getMetaContentByProperty('article:author') || null;

    // Collect the site name (assuming it's stored in a meta tag or can be derived from the document title)
    let siteName = getMetaContentByProperty('og:site_name') || document.title;

    // Collect the site icon (assuming it's stored in a link tag with rel='icon')
    let siteIcon = document.querySelector("link[rel~='icon']") ? document.querySelector("link[rel~='icon']").href : null;

    // Fallbacks for when the data is not found
    author = author || "Unknown Author";
    siteName = siteName || window.location.hostname;
    siteIcon = siteIcon || `https://${window.location.hostname}/favicon.ico`;

    return {
        url: url,
        author: author,
        site_name: siteName,
        site_icon: siteIcon
    };
}

export function cleanWord(word: string)
{
    return word.replace(/[.,/#?!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
}