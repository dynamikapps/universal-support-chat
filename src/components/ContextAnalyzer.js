import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { saveContext, getContext, removeContext } from '../services/storage';

const ContextAnalyzer = ({ onContextSwitch }) => {
  const [savedContexts, setSavedContexts] = useState([]);
  const [highlightedText, setHighlightedText] = useState('');
  const [newContextTitle, setNewContextTitle] = useState('');
  const [isContextEnabled, setIsContextEnabled] = useState(false);

  useEffect(() => {
    loadSavedContexts();
    getHighlightedText();

    // Set up listener for highlighted text changes
    const messageListener = (request) => {
      if (request.action === 'textHighlighted') {
        setHighlightedText(request.text);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const loadSavedContexts = async () => {
    const contexts = await getContext();
    setSavedContexts(contexts);
  };

  const getHighlightedText = () => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getHighlightedText' }, (response) => {
          if (response && response.text) {
            setHighlightedText(response.text);
          }
        });
      });
    }
  };

  const handleSaveContext = async () => {
    if (highlightedText && newContextTitle) {
      const newContext = { title: newContextTitle, text: highlightedText };
      const updatedContexts = [...savedContexts, newContext];
      await saveContext(updatedContexts);
      setSavedContexts(updatedContexts);
      setNewContextTitle('');
      // Clear highlighted text after saving
      setHighlightedText('');
    }
  };

  const handleRemoveContext = async (index) => {
    const updatedContexts = savedContexts.filter((_, i) => i !== index);
    await removeContext(index);
    setSavedContexts(updatedContexts);
  };

  const handleContextSwitch = (enabled) => {
    setIsContextEnabled(enabled);
    onContextSwitch(enabled);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const insertToActiveElement = (text) => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'insertText', text: text });
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Context Analyzer</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isContextEnabled}
            onChange={(e) => handleContextSwitch(e.target.checked)}
            className="mr-2"
          />
          Enable Context
        </label>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Current Highlighted Text:</h3>
        <p>{highlightedText || 'No text highlighted'}</p>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newContextTitle}
          onChange={(e) => setNewContextTitle(e.target.value)}
          placeholder="Enter context title"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSaveContext}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Highlighted Text
        </button>
      </div>
      <div>
        <h3 className="font-bold mb-2">Saved Contexts:</h3>
        <ul>
          {savedContexts.map((context, index) => (
            <li key={index} className="mb-2 p-2 border rounded">
              <h4 className="font-bold">{context.title}</h4>
              <p>{context.text}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleRemoveContext(index)}
                  className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
                <button
                  onClick={() => copyToClipboard(context.text)}
                  className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                >
                  Copy
                </button>
                <button
                  onClick={() => insertToActiveElement(context.text)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Insert
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ContextAnalyzer.propTypes = {
  onContextSwitch: PropTypes.func.isRequired,
};

export default ContextAnalyzer;
