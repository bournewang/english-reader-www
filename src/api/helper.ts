export function fetchMainContent() {
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