(function () {
  // Create container for the chat icon
  const iconContainer = document.createElement("div");
  iconContainer.id = "universal-support-chat-icon";
  iconContainer.style.position = "fixed";
  iconContainer.style.bottom = "20px";
  iconContainer.style.right = "20px";
  iconContainer.style.zIndex = "2147483647"; // Maximum z-index value
  iconContainer.style.cursor = "pointer";
  iconContainer.style.width = "60px";
  iconContainer.style.height = "60px";
  iconContainer.style.borderRadius = "50%";
  iconContainer.style.backgroundColor = "#4F46E5"; // Indigo color
  iconContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  iconContainer.style.display = "flex";
  iconContainer.style.alignItems = "center";
  iconContainer.style.justifyContent = "center";
  document.body.appendChild(iconContainer);

  // Add chat icon
  const chatIcon = document.createElement("img");
  chatIcon.src = chrome.runtime.getURL("icon48.png"); // Use the 48x48 icon
  chatIcon.style.width = "32px";
  chatIcon.style.height = "32px";
  iconContainer.appendChild(chatIcon);

  // Create container for the chat window
  const chatContainer = document.createElement("div");
  chatContainer.id = "universal-support-chat-container";
  chatContainer.style.position = "fixed";
  chatContainer.style.bottom = "90px";
  chatContainer.style.right = "20px";
  chatContainer.style.zIndex = "2147483646"; // One less than the icon
  chatContainer.style.display = "none";
  document.body.appendChild(chatContainer);

  // Create and inject the app's iframe
  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html");
  iframe.style.border = "none";
  iframe.style.width = "350px";
  iframe.style.height = "500px";
  iframe.style.borderRadius = "8px";
  iframe.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  chatContainer.appendChild(iframe);

  // Toggle chat window visibility
  iconContainer.addEventListener("click", () => {
    if (chatContainer.style.display === "none") {
      chatContainer.style.display = "block";
    } else {
      chatContainer.style.display = "none";
    }
  });

  // Make the chat window draggable
  let isDragging = false;
  let dragOffsetX, dragOffsetY;

  chatContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - chatContainer.offsetLeft;
    dragOffsetY = e.clientY - chatContainer.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const left = e.clientX - dragOffsetX;
      const top = e.clientY - dragOffsetY;
      chatContainer.style.left = `${left}px`;
      chatContainer.style.top = `${top}px`;
      chatContainer.style.right = "auto";
      chatContainer.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Handle messages from the React app
  window.addEventListener("message", (event) => {
    if (event.data.type === "RESIZE_CHAT") {
      iframe.style.width = event.data.width;
      iframe.style.height = event.data.height;
    }
  });

  let highlightedText = "";

  document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    highlightedText = selection.toString().trim();

    if (highlightedText) {
      chrome.runtime.sendMessage({
        action: "textHighlighted",
        text: highlightedText,
      });
    }
  });

  // New code: Add message listener for text insertion
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHighlightedText") {
      sendResponse({ text: highlightedText });
    }
    if (request.action === "copyToClipboard") {
      navigator.clipboard
        .writeText(request.text)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          sendResponse({ success: false, error: err.message });
        });
      return true; // Indicates we want to send a response asynchronously
    } else if (request.action === "insertText") {
      const activeElement = document.activeElement;
      if (
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "INPUT"
      ) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const text = activeElement.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        activeElement.value = before + request.text + after;
        activeElement.selectionStart = activeElement.selectionEnd =
          start + request.text.length;
        sendResponse({ success: true });
      } else if (activeElement.isContentEditable) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(request.text);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        sendResponse({ success: true });
      } else {
        sendResponse({
          success: false,
          error: "No suitable input element found",
        });
      }
      return true; // Indicates we want to send a response asynchronously
    }
  });

  // Add event listener for text selection
  document.addEventListener("mouseup", function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      chrome.runtime.sendMessage({
        action: "textSelected",
        text: selectedText,
      });
    }
  });

  // ... rest of the existing code ...
})();
