import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

if (!API_KEY) {
  console.error(
    "OpenAI API key is not set. Please check your environment variables."
  );
}

console.log(
  "API Key (first 5 chars):",
  API_KEY ? API_KEY.substring(0, 5) : "Not set"
);

const API_URL = "https://api.openai.com/v1";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  "OpenAI-Beta": "assistants=v1",
};

export const generateResponse = async (messages, context = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `Context: ${context}` },
          ...messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

export const analyzeImage = async (imageUrl) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What's in this image?" },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const createAssistant = async () => {
  try {
    console.log("Creating assistant...");
    const response = await axios.post(
      `${API_URL}/assistants`,
      {
        name: "Universal Support Chat Assistant",
        instructions: "You are a helpful customer support assistant.",
        model: "gpt-4-1106-preview",
        tools: [{ type: "retrieval" }, { type: "code_interpreter" }],
      },
      { headers }
    );
    console.log("Assistant created:", response.data);
    return response.data.id;
  } catch (error) {
    console.error(
      "Error creating assistant:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const createThread = async () => {
  try {
    const response = await axios.post(`${API_URL}/threads`, {}, { headers });
    return response.data.id;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
};

export const addMessageToThread = async (threadId, content) => {
  try {
    await axios.post(
      `${API_URL}/threads/${threadId}/messages`,
      {
        role: "user",
        content: content,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error adding message to thread:", error);
    throw error;
  }
};

export const runAssistant = async (assistantId, threadId) => {
  try {
    console.log("Running assistant with:", { assistantId, threadId });
    const response = await axios.post(
      `${API_URL}/threads/${threadId}/runs`,
      {
        assistant_id: assistantId,
      },
      { headers }
    );
    console.log("Run response:", response.data);
    return response.data.id;
  } catch (error) {
    console.error(
      "Error running assistant:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getRunStatus = async (threadId, runId) => {
  try {
    console.log(`Getting run status for thread ${threadId} and run ${runId}`);
    const response = await axios.get(
      `${API_URL}/threads/${threadId}/runs/${runId}`,
      { headers }
    );
    console.log("Run status response:", response.data);
    return response.data.status;
  } catch (error) {
    console.error(
      "Error getting run status:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getThreadMessages = async (threadId) => {
  try {
    console.log(`Getting messages for thread ${threadId}`);
    const response = await axios.get(
      `${API_URL}/threads/${threadId}/messages`,
      { headers }
    );
    console.log("Thread messages response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error getting thread messages:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
