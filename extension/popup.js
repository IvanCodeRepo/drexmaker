document.getElementById('submitBtn').addEventListener('click', () => {
  const textInput = document.getElementById('textInput').value;
  try {
    const texts = JSON.parse(textInput);
    if (Array.isArray(texts)) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // chrome.tabs.executeScript(tabs[0].id, { code: `writeThread(${JSON.stringify(texts)});` });
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: writeThread,
          args: [JSON.stringify(texts)]
        });
      });
    } else {
      alert("Please enter a valid JSON array.");
    }
  } catch (error) {
    alert("Error parsing JSON.");
  }
});
