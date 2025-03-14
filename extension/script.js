function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function writeFirstTweet(text) {
    const tweetInput = document.querySelector('[data-testid="tweetTextarea_0"]');
    tweetInput.focus();
    document.execCommand('insertText', false, text);
    await delay(1000);

    document.querySelector('[data-testid="tweetButtonInline"]').click();
    await delay(1000);
}

async function writeReply(text) {
    let responseToButton = document.querySelector('[data-testid="cellInnerDiv"]:nth-child(1) [data-testid="reply"]');

    if (!responseToButton) {
        responseToButton = document.querySelector('[data-testid="cellInnerDiv"]:nth-child(2) [data-testid="reply"]')
    }

    responseToButton.click();
    await delay(1000);

    const tweetInput = document.querySelector('[aria-modal="true"] [data-testid="tweetTextarea_0"]');
    tweetInput.focus();
    document.execCommand('insertText', false, text);
    await delay(1000);

    document.querySelector('[aria-modal="true"] [data-testid="tweetButton"]').click();
    await delay(1000);
}

function parseText(text) {
    let tweets;

    try {
        tweets = JSON.parse(text);
        if (!Array.isArray(tweets)) throw new Error();
    } catch {
        tweets = text.includes('",') ? text.split(/",\s*/) : text.split(/\n+/);
        tweets = tweets.map(tweet => tweet.replace(/^"|"$/g, '').trim()).filter(tweet => tweet.length);
    }

    if (tweets.length === 1 && tweets[0].length > 250) {
        let longText = tweets[0];
        tweets = [];
        while (longText.length > 250) {
            let cutIndex = longText.lastIndexOf(' ', 250);
            if (cutIndex === -1) cutIndex = 250;
            tweets.push(longText.slice(0, cutIndex) + "...");
            longText = "..." + longText.slice(cutIndex).trim();
        }
        tweets.push(longText);
    }

    return tweets;
}

async function writeThread(textsString) {
    const texts = parseText(textsString);
    for (let i = 0; i < texts.length; i++) {
        if (i === 0) {
            await writeFirstTweet(texts[i]);
        } else {
            await writeReply(texts[i]);
        }
    }
}
