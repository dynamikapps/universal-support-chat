const isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

const mockStorage = {
  faq: [],
  conversation: []
};

const setStorageItem = (key, value) => {
  return new Promise((resolve) => {
    if (isExtensionEnvironment) {
      chrome.storage.local.set({ [key]: value }, resolve);
    } else {
      mockStorage[key] = value;
      resolve();
    }
  });
};

const getStorageItem = (key) => {
  return new Promise((resolve) => {
    if (isExtensionEnvironment) {
      chrome.storage.local.get([key], (result) => resolve(result[key]));
    } else {
      resolve(mockStorage[key]);
    }
  });
};

export const saveFAQ = (faqData) => setStorageItem('faq', faqData);

export const getFAQ = () => getStorageItem('faq').then(result => result || []);

export const saveConversation = (conversationData) => setStorageItem('conversation', conversationData);

export const getConversation = () => getStorageItem('conversation').then(result => result || []);