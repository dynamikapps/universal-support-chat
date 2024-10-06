import React, { useState, useEffect } from "react";
import ChatInterface from "./components/ChatInterface";

function App() {
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "textSelected") {
          setSelectedText(request.text);
        }
      });
    }
  }, []);

  return (
    <div className="w-[350px] h-[500px] flex flex-col bg-white rounded-lg shadow-lg">
      <div className="bg-custom-indigo-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h1 className="text-2xl font-bold">Universal Support Chat</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface selectedText={selectedText} />
      </div>
    </div>
  );
}

export default App;
