import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from '../services/openai';
import { saveConversation, getConversation } from '../services/storage';
import { formatDate } from '../utils/helpers';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    const savedMessages = await getConversation();
    setMessages(savedMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const assistantResponse = await generateResponse([...messages, userMessage]);
      const assistantMessage = { role: 'assistant', content: assistantResponse, timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      await saveConversation([...messages, userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-custom-indigo-500 text-white' : 'bg-custom-indigo-100 text-custom-indigo-800'}`}>
              <p>{message.content}</p>
              <span className="text-xs text-custom-indigo-300">{formatDate(message.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-custom-indigo-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-custom-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-indigo-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-custom-indigo-500 text-white rounded-full hover:bg-custom-indigo-600 focus:outline-none focus:ring-2 focus:ring-custom-indigo-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;