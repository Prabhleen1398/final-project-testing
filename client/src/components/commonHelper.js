import React from "react";

const isValidHyperlink = (text) => {
    // Hyperlinks Validation
        const regex = /\[(.*?)\]\((.*?)\)/g;
        // const text = data.text;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const hyperlinkName = match[1];
            const hyperlinkURL = match[2];
            if (!hyperlinkName.trim() || !hyperlinkURL.trim() || !hyperlinkURL.startsWith('https://')) {
                return false;
            }
        }
        return true;
    // const regex = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;
    // // const regex = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/gi;
    // // const regex = /\[([^\]]+)\]\(https:\/\/[^\s)]+\)/gi
    // const matches = [...text.matchAll(regex)];

    // for (const match of matches) {
    //     const hyperlinkName = match[1];
    //     const hyperlinkURL = match[2];

    //     if (!hyperlinkName || !hyperlinkURL || !hyperlinkURL.startsWith('https://')) {
    //         return false; // At least one of the hyperlinks is invalid
    //     }
    // }

    // // Check if there are empty brackets [] or ()
    // if (/\[\]/.test(text) || /\(\)/.test(text)) {
    //     return false;
    // }

    // return true;
};

const processTextWithHyperlinks = (text) => {
    const parts = [];
    let startIndex = 0;

    const regex = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;
    let match;
    while ((match = regex.exec(text))) {
        const linkText = match[1];
        const linkUrl = match[2];
        const preMatch = text.slice(startIndex, match.index);

        if (preMatch) {
            parts.push(preMatch);
        }

        parts.push(
            <a
                key={parts.length}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                {linkText}
            </a>
        );

        startIndex = match.index + match[0].length;
    }

    const remainingText = text.slice(startIndex);
    if (remainingText) {
        parts.push(remainingText);
    }

    return parts;
};

// method to format ques as per the time asked
function formatAnsAskedTime(askDate) {
    const ONE_SECOND = 1000;
    const ONE_MINUTE = 60 * ONE_SECOND;
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;
    const ONE_YEAR = 365 * ONE_DAY;

    const currTime = Date.now();
    const timeDifference = currTime - askDate.getTime();
    const postingDate = new Date(askDate.getTime());

    if (timeDifference < ONE_MINUTE) {
        const secondsAgo = Math.floor(timeDifference / ONE_SECOND);
        return `answered ${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < ONE_HOUR) {
        const minutesAgo = Math.floor(timeDifference / ONE_MINUTE);
        return `answered ${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < ONE_DAY) {
        const hoursAgo = Math.floor(timeDifference / ONE_HOUR);
        return `answered ${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < ONE_YEAR) {
        const month = postingDate.toLocaleString('default', { month: 'short' });
        const day = postingDate.getDate();
        const timeString = postingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedDay = (day < 10 ? '0' : '') + day;
        return `answered ${month} ${formattedDay}, ${timeString}`;
    } else {
        const month = postingDate.toLocaleString('default', { month: 'short' });
        const day = postingDate.getDate();
        const year = postingDate.getFullYear();
        const timeString = postingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedDay = (day < 10 ? '0' : '') + day;
        return `answered ${month} ${formattedDay}, ${year}, ${timeString}`;
    }
}


export {processTextWithHyperlinks, isValidHyperlink, formatAnsAskedTime}