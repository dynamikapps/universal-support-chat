import React, { useState, useEffect } from "react";
import ChatInterface from "./components/ChatInterface";
import FAQManager from "./components/FAQManager";
import ContextAnalyzer from "./components/ContextAnalyzer";
import { getContext } from "./services/storage";

function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isContextEnabled, setIsContextEnabled] = useState(false);
  const [savedContexts, setSavedContexts] = useState([]);
  const [selectedContextIndices, setSelectedContextIndices] = useState([]);

  useEffect(() => {
    loadSavedContexts();
  }, []);

  useEffect(() => {
    // Send message to content script to resize iframe
    window.parent.postMessage(
      {
        type: "RESIZE_CHAT",
        width: isMinimized ? "60px" : isExpanded ? "500px" : "350px",
        height: isMinimized ? "60px" : isExpanded ? "600px" : "500px",
      },
      "*"
    );
  }, [isExpanded, isMinimized]);

  const loadSavedContexts = async () => {
    const contexts = await getContext();
    setSavedContexts(contexts);
  };

  const handleContextSwitch = (enabled) => {
    setIsContextEnabled(enabled);
  };

  const handleContextSelection = (indices) => {
    setSelectedContextIndices(indices);
  };

  const handleContextUpdate = (updatedContexts) => {
    setSavedContexts(updatedContexts);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div
        className="w-[60px] h-[60px] bg-custom-indigo-600 flex items-center justify-center cursor-pointer"
        onClick={toggleMinimize}
      >
        <img src="/icon16.svg" alt="Chat Icon" className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${
        isExpanded ? "w-[500px] h-[600px]" : "w-[350px] h-[500px]"
      } bg-white rounded-lg shadow-lg`}
    >
      <div className="bg-custom-indigo-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h1 className="text-2xl font-bold">Universal Support Chat</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-custom-indigo-200"
          >
            {isExpanded ? "➖" : "➕"}
          </button>
          <button
            onClick={toggleMinimize}
            className="text-white hover:text-custom-indigo-200"
          >
            🗕
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === "chat" && (
          <ChatInterface
            isContextEnabled={isContextEnabled}
            savedContexts={savedContexts}
            selectedContextIndices={selectedContextIndices}
          />
        )}
        {activeTab === "faq" && <FAQManager />}
        {activeTab === "context" && (
          <ContextAnalyzer
            onContextSwitch={handleContextSwitch}
            isContextEnabled={isContextEnabled}
            savedContexts={savedContexts}
            selectedContextIndices={selectedContextIndices}
            onContextSelection={handleContextSelection}
            onContextUpdate={handleContextUpdate}
          />
        )}
      </div>
      <div className="bg-custom-indigo-100 p-2 flex justify-around rounded-b-lg">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded ${
            activeTab === "chat"
              ? "bg-custom-indigo-500 text-white"
              : "bg-custom-indigo-200 text-custom-indigo-800"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2 rounded ${
            activeTab === "faq"
              ? "bg-custom-indigo-500 text-white"
              : "bg-custom-indigo-200 text-custom-indigo-800"
          }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab("context")}
          className={`px-4 py-2 rounded ${
            activeTab === "context"
              ? "bg-custom-indigo-500 text-white"
              : "bg-custom-indigo-200 text-custom-indigo-800"
          }`}
        >
          Context
        </button>
      </div>
    </div>
  );
}

export default App;
