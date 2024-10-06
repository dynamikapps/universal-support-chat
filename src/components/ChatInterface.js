import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { handleChatInteraction } from "../services/openai";
import { formatDate } from "../utils/helpers";
import ReactMarkdown from "react-markdown";

const ChatInterface = ({ selectedText }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedText) {
      setInput(
        (prevInput) => `${prevInput}\n\nSelected text: "${selectedText}"`
      );
    }
  }, [selectedText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const { threadId: newThreadId, response } = await handleChatInteraction(
        input,
        threadId
      );

      if (!threadId) {
        setThreadId(newThreadId);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error in chat interaction:", error);
      setError(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "copyToClipboard", text: text },
          function (response) {
            if (response && response.success) {
              alert("Copied to clipboard!");
            } else {
              console.error(
                "Failed to copy: ",
                response ? response.error : "Unknown error"
              );
            }
          }
        );
      });
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
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

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (element) => {
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, 4 * 24); // Assuming 24px line height
    element.style.height = `${newHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  className="prose prose-sm max-w-none"
                  components={{
                    code({ className, children, ...props }) {
                      return (
                        <code
                          className={`${className} bg-gray-200 rounded px-1`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
              <span className="text-xs text-custom-indigo-300 mt-1 block">
                {formatDate(message.timestamp)}
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
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-indigo-500"></div>
          </div>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-custom-indigo-200">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-custom-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-indigo-500 resize-none overflow-y-auto"
              placeholder="Type your message..."
              rows="1"
              style={{ minHeight: "40px", maxHeight: "96px" }} // 4 lines * 24px line height
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-custom-indigo-500 text-white rounded-full hover:bg-custom-indigo-600 focus:outline-none focus:ring-2 focus:ring-custom-indigo-500 h-10"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

ChatInterface.propTypes = {
  selectedText: PropTypes.string,
};

export default ChatInterface;
