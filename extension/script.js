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

async function writeThread(textsString) {
    const texts = JSON.parse(textsString);
    for (let i = 0; i < texts.length; i++) {
        if (i === 0) {
            await writeFirstTweet(texts[i]);
        } else {
            await writeReply(texts[i]);
        }
    }
}
