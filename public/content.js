(function () {
  // Create container for the app
  const container = document.createElement("div");
  container.id = "universal-support-chat-container";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  // Create and inject the app's iframe
  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html");
  iframe.style.border = "none";
  iframe.style.width = "350px";
  iframe.style.height = "500px";
  iframe.style.borderRadius = "8px";
  iframe.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  container.appendChild(iframe);

  // Make the container draggable
  let isDragging = false;
  let dragOffsetX, dragOffsetY;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - container.offsetLeft;
    dragOffsetY = e.clientY - container.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const left = e.clientX - dragOffsetX;
      const top = e.clientY - dragOffsetY;
      container.style.left = `${left}px`;
      container.style.top = `${top}px`;
      container.style.right = "auto";
      container.style.bottom = "auto";
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
})();
