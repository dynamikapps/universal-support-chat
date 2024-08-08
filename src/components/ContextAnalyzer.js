import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { saveContext, removeContext } from "../services/storage";

const ContextAnalyzer = ({
  onContextSwitch,
  isContextEnabled,
  savedContexts,
  selectedContextIndices,
  onContextSelection,
  onContextUpdate,
}) => {
  const [highlightedText, setHighlightedText] = useState("");
  const [newContextTitle, setNewContextTitle] = useState("");

  useEffect(() => {
    getHighlightedText();

    const messageListener = (request) => {
      if (request.action === "textHighlighted") {
        setHighlightedText(request.text);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const getHighlightedText = () => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getHighlightedText" },
          (response) => {
            if (response && response.text) {
              setHighlightedText(response.text);
            }
          }
        );
      });
    }
  };

  const handleSaveContext = async () => {
    if (highlightedText && newContextTitle) {
      const newContext = { title: newContextTitle, text: highlightedText };
      const updatedContexts = [...savedContexts, newContext];
      await saveContext(updatedContexts);
      onContextUpdate(updatedContexts);
      setNewContextTitle("");
      setHighlightedText("");
    }
  };

  const handleRemoveContext = async (index) => {
    const updatedContexts = savedContexts.filter((_, i) => i !== index);
    await removeContext(index);
    onContextUpdate(updatedContexts);
  };

  const handleContextSelect = (index) => {
    const newSelectedIndices = [...selectedContextIndices];
    if (newSelectedIndices.includes(index)) {
      newSelectedIndices.splice(newSelectedIndices.indexOf(index), 1);
    } else {
      newSelectedIndices.push(index);
    }
    onContextSelection(newSelectedIndices);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const insertToActiveElement = (text) => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "insertText",
          text: text,
        });
      });
    } else {
      alert(
        "Insert functionality is only available in the Chrome extension environment."
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 overflow-y-auto flex-grow">
        <h2 className="text-xl font-bold mb-4">Context Analyzer</h2>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isContextEnabled}
              onChange={(e) => onContextSwitch(e.target.checked)}
              className="mr-2"
            />
            Enable Context
          </label>
        </div>
        <div className="mb-4">
          <h3 className="font-bold">Current Highlighted Text:</h3>
          <div className="max-h-40 overflow-y-auto border p-2 rounded">
            <p>{highlightedText || "No text highlighted"}</p>
          </div>
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
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Highlighted Text
          </button>
        </div>
        <div>
          <h3 className="font-bold mb-2">Saved Contexts:</h3>
          <ul className="space-y-2">
            {savedContexts.map((context, index) => (
              <li key={index} className="p-2 border rounded">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedContextIndices.includes(index)}
                    onChange={() => handleContextSelect(index)}
                    className="mr-2"
                  />
                  <h4 className="font-bold">{context.title}</h4>
                </label>
                <p className="max-h-20 overflow-y-auto mt-2">{context.text}</p>
                <div className="mt-2">
                  <button
                    onClick={() => handleRemoveContext(index)}
                    className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => copyToClipboard(context.text)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => insertToActiveElement(context.text)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Insert
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ContextAnalyzer.propTypes = {
  onContextSwitch: PropTypes.func.isRequired,
  isContextEnabled: PropTypes.bool.isRequired,
  savedContexts: PropTypes.array.isRequired,
  selectedContextIndices: PropTypes.array.isRequired,
  onContextSelection: PropTypes.func.isRequired,
  onContextUpdate: PropTypes.func.isRequired,
};

export default ContextAnalyzer;
