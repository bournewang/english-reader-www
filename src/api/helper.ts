import axios, { AxiosRequestConfig } from 'axios';

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
    let paragraphs = []
    let i = 1
    ps.forEach((p) => {
        paragraphs[i++] = p.innerText
    })
    return {title: document.title, paragraphs, translations: []}
}

const BASE_API_URL = process.env.PLASMO_PUBLIC_BASE_API_URL;

const getToken = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["token"], (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result.token);
        });
    });
};

export const apiRequest = async (url: string, method: 'GET' | 'POST', data?: any): Promise<any> => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Token is not set. Please log in.');
        }        
        const config: AxiosRequestConfig = {
            method,
            url: `${BASE_API_URL}${url}`,
            headers: { Authorization: `Bearer ${token}` },
            data,
        };
        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
