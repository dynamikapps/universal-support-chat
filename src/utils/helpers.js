export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const extractPageContent = () => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, (response) => {
          resolve(response?.content || "Unable to extract page content.");
        });
      });
    } else {
      resolve("Page content extraction is not available in this environment.");
    }
  });
};