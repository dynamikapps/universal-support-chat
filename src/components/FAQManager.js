import React, { useState, useEffect } from "react";
import { saveFAQ, getFAQ } from "../services/storage";

const FAQManager = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    loadFAQ();
  }, []);

  const loadFAQ = async () => {
    const savedFAQ = await getFAQ();
    setFaqItems(savedFAQ);
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newItem = { question: newQuestion, answer: newAnswer };
    const updatedFAQ = [...faqItems, newItem];
    setFaqItems(updatedFAQ);
    await saveFAQ(updatedFAQ);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleEditFAQ = (index) => {
    setEditIndex(index);
    setNewQuestion(faqItems[index].question);
    setNewAnswer(faqItems[index].answer);
  };

  const handleUpdateFAQ = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const updatedFAQ = [...faqItems];
    updatedFAQ[editIndex] = { question: newQuestion, answer: newAnswer };
    setFaqItems(updatedFAQ);
    await saveFAQ(updatedFAQ);
    setEditIndex(null);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleRemoveFAQ = async (index) => {
    const updatedFAQ = faqItems.filter((_, i) => i !== index);
    setFaqItems(updatedFAQ);
    await saveFAQ(updatedFAQ);
  };

  const copyToClipboard = (text) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "copyToClipboard", text: text },
          function (response) {
            if (response.success) {
              alert("Copied to clipboard!");
            } else {
              alert("Failed to copy: " + response.error);
            }
          }
        );
      });
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          alert("Failed to copy: " + err);
        });
    }
  };

  const insertToActiveElement = (text) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "insertText", text: text },
          function (response) {
            if (response.success) {
              alert("Text inserted!");
            } else {
              alert("Failed to insert: " + response.error);
            }
          }
        );
      });
    } else {
      alert(
        "Insert functionality is only available in the Chrome extension environment."
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">FAQ Manager</h2>
      <form
        onSubmit={editIndex !== null ? handleUpdateFAQ : handleAddFAQ}
        className="mb-4"
      >
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full px-4 py-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter question"
        />
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full px-4 py-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter answer"
          rows="3"
        ></textarea>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {editIndex !== null ? "Update FAQ Item" : "Add FAQ Item"}
        </button>
      </form>
      <ul className="space-y-4">
        {faqItems.map((item, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold">{item.question}</h3>
            <p className="mt-2">{item.answer}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEditFAQ(index)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemoveFAQ(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
              <button
                onClick={() => copyToClipboard(item.answer)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Copy Answer
              </button>
              <button
                onClick={() => insertToActiveElement(item.answer)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Insert Answer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQManager;
