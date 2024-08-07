import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import FAQManager from './components/FAQManager';
import ContextAnalyzer from './components/ContextAnalyzer';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);  // Changed to true

  useEffect(() => {
    // Send message to content script to resize iframe
    window.parent.postMessage({
      type: 'RESIZE_CHAT',
      width: isMinimized ? '60px' : (isExpanded ? '500px' : '350px'),
      height: isMinimized ? '60px' : (isExpanded ? '600px' : '500px')
    }, '*');
  }, [isExpanded, isMinimized]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div className="w-[60px] h-[60px] rounded-full bg-custom-indigo-600 flex items-center justify-center cursor-pointer" onClick={toggleMinimize}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isExpanded ? 'w-[500px] h-[600px]' : 'w-[350px] h-[500px]'} bg-white rounded-lg shadow-lg`}>
      <div className="bg-custom-indigo-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h1 className="text-2xl font-bold">Universal Support Chat</h1>
        <div className="flex space-x-2">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-custom-indigo-200">
            {isExpanded ? '➖' : '➕'}
          </button>
          <button onClick={toggleMinimize} className="text-white hover:text-custom-indigo-200">
            🗕
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'faq' && <FAQManager />}
        {activeTab === 'context' && <ContextAnalyzer />}
      </div>
      <div className="bg-custom-indigo-100 p-2 flex justify-around rounded-b-lg">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded ${activeTab === 'chat' ? 'bg-custom-indigo-500 text-white' : 'bg-custom-indigo-200 text-custom-indigo-800'}`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded ${activeTab === 'faq' ? 'bg-custom-indigo-500 text-white' : 'bg-custom-indigo-200 text-custom-indigo-800'}`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('context')}
          className={`px-4 py-2 rounded ${activeTab === 'context' ? 'bg-custom-indigo-500 text-white' : 'bg-custom-indigo-200 text-custom-indigo-800'}`}
        >
          Context
        </button>
      </div>
    </div>
  );
}

export default App;