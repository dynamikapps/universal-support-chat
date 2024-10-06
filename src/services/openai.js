import axios from "axios";
import config from "../config.json";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1";

if (!API_KEY) {
  console.error(
    "OpenAI API key is not set. Please check your environment variables."
  );
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  "OpenAI-Beta": "assistants=v2",
};

// This function is a placeholder and should be implemented properly in a production environment
const saveConfigToFile = (updatedConfig) => {
  console.warn(
    "saveConfigToFile is not implemented. In a real application, this should update the config file."
  );
  // In a real application, you would update the config file here
  // For now, we'll just update the in-memory config object
  Object.assign(config, updatedConfig);
};

export const getOrCreateAssistant = async () => {
  if (config.openai_assistant_id) {
    return config.openai_assistant_id;
  }

  try {
    const response = await axios.post(
      `${API_URL}/assistants`,
      {
        name: "Universal Support Chat Assistant",
        instructions: "You are a helpful customer support assistant.",
        model: "gpt-4o", // Updated model name
        tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
      },
      { headers }
    );

    const updatedConfig = { ...config, openai_assistant_id: response.data.id };
    saveConfigToFile(updatedConfig);

    return response.data.id;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
};

export const createThread = async () => {
  try {
    const response = await axios.post(`${API_URL}/threads`, {}, { headers });
    return response.data.id;
  } catch (error) {
    console.error(
      "Error creating thread:",
      error.response?.data || error.message
    );
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
    console.error(
      "Error adding message to thread:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const runAssistant = async (assistantId, threadId) => {
  try {
    const response = await axios.post(
      `${API_URL}/threads/${threadId}/runs`,
      {
        assistant_id: assistantId,
      },
      { headers }
    );
    return response.data.id;
  } catch (error) {
    console.error(
      "Error running assistant:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getRunStatus = async (threadId, runId) => {
  try {
    const response = await axios.get(
      `${API_URL}/threads/${threadId}/runs/${runId}`,
      { headers }
    );
    return response.data.status;
  } catch (error) {
    console.error(
      "Error getting run status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getThreadMessages = async (threadId) => {
  try {
    const response = await axios.get(
      `${API_URL}/threads/${threadId}/messages`,
      { headers }
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error getting thread messages:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleChatInteraction = async (message, threadId) => {
  try {
    const assistantId = await getOrCreateAssistant();

    if (!threadId) {
      threadId = await createThread();
    }

    await addMessageToThread(threadId, message);
    const runId = await runAssistant(assistantId, threadId);

    let status;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await getRunStatus(threadId, runId);
    } while (status === "queued" || status === "in_progress");

    if (status === "completed") {
      const messages = await getThreadMessages(threadId);
      return {
        threadId,
        response: messages[0].content[0].text.value,
      };
    } else {
      throw new Error(`Run failed with status: ${status}`);
    }
  } catch (error) {
    console.error(
      "Error in handleChatInteraction:",
      error.response?.data || error.message
    );
    throw error;
  }
};
