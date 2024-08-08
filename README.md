# Universal Customer Support Chat Tool

A powerful Google Chrome extension that provides AI-powered customer support across various platforms using OpenAI's GPT-4. Enhance your customer service capabilities with context-aware conversations and seamless integration into any webpage.

## 🌟 Features

- 🌐 Universal access from any webpage
- 🤖 AI-powered responses using GPT-4
- 📊 Context-aware conversations with webpage analysis
- 📚 FAQ management for quick answers
- 🎨 Modern, draggable chat interface
- 🔽 Minimizable chat window for distraction-free browsing
- 🖱️ Quick-reply buttons for common responses
- 📋 Copy and insert functionality for chat messages

## 🛠️ Tech Stack

- ⚛️ React.js for dynamic UI
- 🎨 Tailwind CSS for sleek styling
- 🧠 OpenAI API (GPT-4) for intelligent responses
- 🔌 Chrome Extension APIs for seamless integration

## 🚀 Setup

1. Clone the repository:
   ```
   git clone https://github.com/dynamikapps/universal-support-chat.git
   cd universal-support-chat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```

4. Build the extension:
   ```
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked"
   - Select the `build` folder in your project directory

## 🎯 Usage

After installation, the chat icon will appear in the lower right corner of web pages. Click on the icon to expand the chat interface.

- 💬 **Chat**: Interact with the AI assistant for customer support queries.
- 📋 **FAQ**: Manage frequently asked questions and answers.
- 🔍 **Context**: Analyze the current webpage for relevant information and manage saved contexts.

You can drag the chat window to reposition it on the page. Use the minimize button to collapse the chat back to an icon.

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
├── public/
│   ├── content.js
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ChatInterface.js
│   │   ├── ContextAnalyzer.js
│   │   └── FAQManager.js
│   ├── services/
│   │   ├── openai.js
│   │   └── storage.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── README.md
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

- [OpenAI](https://openai.com/) for providing the GPT-4 API
- [React](https://reactjs.org/) for the powerful UI library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/) for enabling browser integration

## Contact

For any inquiries or feedback, please contact [handy@dynamikapps.com](mailto:handy@dynamikapps.com).