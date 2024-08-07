import React, { useState, useEffect } from 'react';
import { saveFAQ, getFAQ } from '../services/storage';

const FAQManager = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

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
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleRemoveFAQ = async (index) => {
    const updatedFAQ = faqItems.filter((_, i) => i !== index);
    setFaqItems(updatedFAQ);
    await saveFAQ(updatedFAQ);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">FAQ Manager</h2>
      <form onSubmit={handleAddFAQ} className="mb-4">
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
          Add FAQ Item
        </button>
      </form>
      <ul className="space-y-4">
        {faqItems.map((item, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold">{item.question}</h3>
            <p className="mt-2">{item.answer}</p>
            <button
              onClick={() => handleRemoveFAQ(index)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQManager;