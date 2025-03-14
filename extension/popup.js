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

function toggleSubmitButton() {
    const ul = document.getElementById('previewTweets');
    const texts = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim());
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = texts.length === 0;
}

function togglePreview() {
    const textInputValue = document.getElementById('textInput').value;
    const previewBtn = document.getElementById('previewBtn');
    previewBtn.disabled = textInputValue.length === 0;
    const ul = document.getElementById('previewTweets');
    ul.innerHTML = "";
    toggleSubmitButton();
}

document.getElementById('textInput').addEventListener('change', () => {
    togglePreview();
});

document.getElementById('textInput').addEventListener('keyup', () => {
    togglePreview();
});

document.getElementById('previewBtn').addEventListener('click', () => {
    const textInputValue = document.getElementById('textInput').value;
    try {
        const texts = parseText(textInputValue);
        if (Array.isArray(texts)) {
            const ul = document.getElementById("previewTweets");
            ul.innerHTML = "";
            texts.forEach(text => {
                const li = document.createElement("li");
                li.textContent = text;
                ul.appendChild(li);
            });
            toggleSubmitButton();
        } else {
            alert("Please enter a valid format.");
        }
    } catch (error) {
        alert("Error parsing tweets.");
    }
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const ul = document.getElementById('previewTweets');
    const texts = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim());

    if (texts.length === 0) {
        alert("No tweets found in the preview list.");
        return;
    }

    try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: writeThread,
                args: [JSON.stringify(texts)]
            });
        });
    } catch (error) {
        alert("Error processing tweets.");
    }
});

