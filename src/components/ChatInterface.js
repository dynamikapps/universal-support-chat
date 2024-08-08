import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { generateResponse } from "../services/openai";
import {
  saveConversation,
  getConversation,
  getContext,
} from "../services/storage";
import { formatDate } from "../utils/helpers";

const ChatInterface = ({ isContextEnabled }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    const savedMessages = await getConversation();
    setMessages(
      savedMessages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      let context = "";
      if (isContextEnabled) {
        const highlightedText = await getHighlightedText();
        const savedContexts = await getContext();
        context = `Highlighted Text: ${highlightedText}\n\nSaved Contexts:\n${savedContexts
          .map((c) => `${c.title}: ${c.text}`)
          .join("\n")}`;
      }

      const assistantResponse = await generateResponse(
        [...messages, userMessage],
        context
      );
      const assistantMessage = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      await saveConversation([...messages, userMessage, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  const getHighlightedText = () => {
    return new Promise((resolve) => {
      if (chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "getHighlightedText" },
            (response) => {
              resolve(response.text || "");
            }
          );
        });
      } else {
        resolve("");
      }
    });
  };

  const handleQuickReply = (replyText) => {
    setInput(replyText);
  };

  const quickReplies = [
    { label: "Reply to Email", text: "Here's a draft reply to the email:" },
    { label: "Answer Question", text: "To answer your question:" },
    { label: "Provide Summary", text: "Here's a summary of the key points:" },
  ];

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
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-custom-indigo-500 text-white"
                  : "bg-custom-indigo-100 text-custom-indigo-800"
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs text-custom-indigo-300">
                {message.timestamp instanceof Date && !isNaN(message.timestamp)
                  ? formatDate(message.timestamp)
                  : "Invalid Date"}
              </span>
              <div className="mt-2">
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="text-xs mr-2 text-custom-indigo-300 hover:text-custom-indigo-500"
                >
                  Copy
                </button>
                <button
                  onClick={() => insertToActiveElement(message.content)}
                  className="text-xs text-custom-indigo-300 hover:text-custom-indigo-500"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t border-custom-indigo-200">
        <div className="flex flex-wrap gap-2 mb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply.text)}
              className="px-3 py-1 text-sm bg-custom-indigo-100 text-custom-indigo-700 rounded-full hover:bg-custom-indigo-200"
            >
              {reply.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
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
        </form>
      </div>
    </div>
  );
};

ChatInterface.propTypes = {
  isContextEnabled: PropTypes.bool.isRequired,
};

export default ChatInterface;
