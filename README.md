# Universal Customer Support Chat Tool

A powerful Google Chrome extension that leverages OpenAI's Assistant API to provide intelligent customer support capabilities. This tool uses GPT-4o with both Code Interpreter and Retrieval tools enabled, allowing for context-aware conversations and advanced problem-solving capabilities.

## 🌟 Features

- 🤖 Powered by OpenAI's Assistant API with GPT-4o
- 📊 Code Interpreter for complex calculations and data analysis
- 📚 Knowledge Retrieval for accurate information access
- 🌐 Universal access from any webpage
- 💬 Context-aware conversations with webpage analysis
- 🎨 Modern, draggable chat interface
- 🔽 Minimizable chat window
- 📋 Copy and insert functionality for chat messages
- ✨ Text selection integration for contextual queries

## 🛠️ Tech Stack

- ⚛️ React.js for dynamic UI
- 🎨 Tailwind CSS for styling
- 🧠 OpenAI Assistant API
- 🔌 Chrome Extension APIs
- 📦 Vector store for knowledge retrieval

## 🚀 Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/dynamikapps/universal-support-chat
   cd universal-support-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:

   ```bash
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```

4. Create an Assistant in OpenAI Playground:

   - Go to [OpenAI Playground](https://platform.openai.com/playground)
   - Create a new Assistant with the following configuration:
     - Model: gpt-4o
     - Tools: Enable Code Interpreter and Retrieval
     - Instructions: "You are a helpful customer support assistant."
   - Copy the Assistant ID

5. Update the config file:

   - Navigate to `src/config.json`
   - Replace the existing assistant_id with your new Assistant ID:

   ```json
   {
     "openai_assistant_id": "your_assistant_id_here"
   }
   ```

6. Build the extension:

   ```bash
   npm run build
   ```

7. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

## 🎯 Usage

The chat interface appears as an icon in the lower right corner of web pages:

- 💬 **Chat**: Interact with the AI assistant powered by GPT-4o
- 📝 **Text Selection**: Highlight any text on the webpage to include it in your query
- 📋 **Copy/Insert**: Easily copy assistant responses or insert them into text fields
- 🔄 **Context-Aware**: The assistant understands the context of your current webpage
- 💻 **Code Execution**: Can run code to solve complex problems or analyze data

## 💻 Development

For local development:

1. Run `npm start` for development server
2. Make changes in the `src` directory
3. Reload the extension in Chrome after changes
4. Test the assistant functionality with various queries

## 🔐 Security Note

Never commit your OpenAI API key or Assistant ID to version control. Always use environment variables for sensitive information.

[Rest of the README remains the same from the folder structure section onwards]

## 💻 Development

For local development:

1. Run `npm start` to start the development server.
2. Make your changes in the `src` directory.
3. Reload the extension in Chrome after making changes:
   - Go to `chrome://extensions/`
   - Find the Universal Customer Support Chat Tool
   - Click the refresh icon

## 🎨 Customization

- Modify the color scheme in `tailwind.config.js`
- Update the extension icon by replacing `icon16.png`, `icon48.png`, and `icon128.png` in the `public` folder
- Customize quick-reply options in `ChatInterface.js`

## 📁 Folder Structure

```
universal-support-chat/
├── README.md
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── content.js
│   ├── icon128.png
│   ├── icon128.svg
│   ├── icon16.png
│   ├── icon16.svg
│   ├── icon48.png
│   ├── icon48.svg
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.js
│   ├── components
│   │   ├── ChatInterface.js
│   │   ├── ContextAnalyzer.js
│   │   └── FAQManager.js
│   ├── config.json
│   ├── index.css
│   ├── index.js
│   ├── services
│   │   ├── openai.js
│   │   └── storage.js
│   └── utils
│       └── helpers.js
└── tailwind.config.js
```

## 🤝 Contributing

We welcome contributions to improve the Universal Customer Support Chat Tool! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for providing the GPT-4o API
- [React](https://reactjs.org/) for the powerful UI library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/) for enabling browser integration

## Contact

For any inquiries or feedback, please contact [handy@dynamikapps.com](mailto:handy@dynamikapps.com).
