# 🤖 Rhyniox AI - Voice Assistant

**Rhyniox AI** is an advanced voice-powered AI assistant built with cutting-edge web technologies, featuring a beautiful animated interface and natural conversation capabilities. Inspired by Jarvis from Iron Man, Rhyniox provides a friendly, conversational AI experience with stunning visual effects and voice interaction.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18.x-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://rhyniox-ai.vercel.app/](https://rhyniox-ai.vercel.app/)
- **Backend API (Render)**: [https://rhyniox-ai.onrender.com/](https://rhyniox-ai.onrender.com/)

Experience Rhyniox AI directly in your browser! Click the link above to start conversation with your AI assistant.

## ✨ Features

### 🎙️ **Voice Interaction**

- **Speech Recognition**: Real-time voice input processing
- **Text-to-Speech**: Natural voice responses with customizable voices
- **Microphone Visualization**: Animated audio waveforms and visual feedback
- **Hands-free Operation**: Voice-activated conversation flow

### 🎨 **Stunning Visual Interface**

- **Dynamic Day/Night Modes**: Beautiful animated backgrounds with time-based themes
- **Interactive Animations**: Floating elements, animated sun/moon, flying birds
- **Responsive Design**: Optimized for all screen sizes and devices
- **Smooth Transitions**: CSS animations and particle effects

### 🧠 **AI-Powered Conversations**

- **Groq API Integration**: Powered by advanced language models
- **Contextual Responses**: Maintains conversation context and memory
- **Friendly Personality**: Behaves like a supportive friend, not just an assistant
- **Natural Language Processing**: Understands and responds to complex queries

### 🌟 **Advanced Features**

- **Real-time Audio Analysis**: Visual microphone feedback
- **Cross-browser Compatibility**: Works on modern web browsers
- **Secure API Integration**: Environment-based configuration
- **Error Handling**: Robust error management and user feedback

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0 or higher)
- **npm** (Node Package Manager)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Groq API Key** (for AI functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/rhyniox-ai.git
   cd rhyniox-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   OPENAI_API_KEY=your_groq_api_key_here
   ```

   📝 **Note**: Despite the variable name, this actually uses the Groq API key.

4. **Start the server**

   ```bash
   npm start
   ```

5. **Open your browser**

   Navigate to `http://localhost:5000` to experience Rhyniox AI locally, or visit the live demo at [https://rhyniox-ai.vercel.app/](https://rhyniox-ai.vercel.app/)

## 🌐 Deployment

This project is deployed using modern cloud platforms:

- **Frontend**: Deployed on [Vercel](https://vercel.com/) for optimal performance and global CDN
- **Backend**: Deployed on [Render](https://render.com/) with auto-scaling capabilities
- **Assets**: Served directly from GitHub for reliable asset delivery

### Deploy Your Own Instance

**Frontend (Vercel):**

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Deploy the `frontend` folder
4. Update the API endpoint in the HTML file

**Backend (Render):**

1. Connect your GitHub account to Render
2. Create a new web service
3. Set the root directory to `backend`
4. Add your `OPENAI_API_KEY` environment variable

## 🛠️ Project Structure

```
rhyniox-ai/
├── 📁 backend/              # Node.js/Express server
│   ├── � package.json      # Backend dependencies
│   └── 📄 server.js         # Express server with Groq API
├── � frontend/             # Frontend application
│   ├── 📄 Rhynoix-AI.html   # Main application interface
│   └── 📄 vercel.json       # Vercel deployment config
├── � Lottie-files/         # Animation assets
│   ├── 🎬 birds-flying.json
│   ├── 🎬 Search Mic wave.json
│   ├── 🎬 Tree in the wind.json
│   ├── 🖼️ rhynoix_ai.png
│   └── 🖼️ rhynoix.png
├── 📄 .env                  # Environment variables (API keys)
├── 📄 .gitignore           # Git ignore file
├── 📄 package.json         # Root project configuration
├── 📄 render.yaml          # Render deployment config
└── 📄 README.md            # This file
```

## 🔧 Technical Architecture

### Backend (Node.js/Express)

- **Express.js** server handling API requests
- **Groq API** integration for AI responses
- **CORS** enabled for cross-origin requests
- **Body-parser** for JSON request handling
- **Environment configuration** with dotenv

### Frontend (Vanilla HTML/CSS/JavaScript)

- **Responsive CSS Grid/Flexbox** layouts
- **Web Speech API** for voice recognition
- **Speech Synthesis API** for text-to-speech
- **Canvas API** for audio visualizations
- **CSS Animations** for smooth visual effects

### Key Technologies

| Technology       | Purpose             |
| ---------------- | ------------------- |
| Node.js          | Backend runtime     |
| Express.js       | Web framework       |
| Groq API         | AI language model   |
| Web Speech API   | Voice recognition   |
| Speech Synthesis | Text-to-speech      |
| CSS3 Animations  | Visual effects      |
| HTML5 Canvas     | Audio visualization |

## 🎯 Usage Guide

### Starting a Conversation

1. **Visit the live demo** at [https://rhyniox-ai.vercel.app/](https://rhyniox-ai.vercel.app/)
2. **Allow microphone access** when prompted
3. **Click the microphone button** or say "Hey Jarvis"
4. **Speak your question** or command
5. **Listen to Rhyniox's response** and continue the conversation

### Voice Commands Examples

```
🗣️ "Hello Rhyniox, how are you today?"
🗣️ "What's the weather like?"
🗣️ "Tell me a joke"
🗣️ "Help me with my homework"
🗣️ "What can you do?"
```

### Interface Themes

- **Night Mode**: Dark theme with stars, moon, and mystical atmosphere
- **Day Mode**: Bright theme with sun, clouds, and natural elements
- **Animated Elements**: Flying birds, swaying trees, and celestial objects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## ⚙️ Configuration

### API Configuration

Update the `.env` file with your Groq API credentials:

```env
OPENAI_API_KEY=gsk_your_groq_api_key_here
```

### Server Configuration

Modify `backend/server.js` to change:

- **Port number** (default: 5000, but uses process.env.PORT in production)
- **AI model** (default: "openai/gpt-oss-120b")
- **System prompts** and personality
- **CORS settings** for additional domains

### Voice Settings

Customize voice preferences in the JavaScript:

```javascript
// Preferred voice selection
const preferredVoice = voices.find(
  (voice) => voice.name.includes("Google") || voice.name.includes("Microsoft")
);
```

## 🔒 Security & Privacy

- **API Key Protection**: Environment variables keep credentials secure
- **Local Processing**: Voice recognition happens in the browser
- **HTTPS Ready**: Supports secure connections
- **No Data Storage**: Conversations are not permanently stored

## 🚨 Troubleshooting

### Common Issues

**🎤 Microphone not working?**

- Ensure browser permissions are granted
- Check if microphone is connected and working
- Try refreshing the page and allowing access again

**🤖 AI not responding?**

- Verify your Groq API key is correct in the backend environment
- Check if the backend service is running at [https://rhyniox-ai.onrender.com/health](https://rhyniox-ai.onrender.com/health)
- Check browser console for CORS or network errors
- Ensure backend and frontend are properly connected

**🔊 No voice output?**

- Ensure speakers/headphones are connected
- Check browser audio settings
- Verify text-to-speech is supported

**🖥️ Interface not loading?**

- Try visiting the live demo: [https://rhyniox-ai.vercel.app/](https://rhyniox-ai.vercel.app/)
- Clear browser cache and reload
- Disable browser extensions that might block content
- Check JavaScript is enabled
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Install development dependencies
npm install --dev

# Run in development mode
npm run dev

# Test the application
npm test
```

## 📋 Roadmap

### 🔜 Upcoming Features

- [ ] Multi-language support
- [ ] Custom voice training
- [ ] Mobile app version
- [ ] Integration with smart home devices
- [ ] Conversation history
- [ ] Offline mode capabilities

### 🎯 Future Enhancements

- [ ] Plugin system
- [ ] Advanced AI models
- [ ] Video chat capabilities
- [ ] AR/VR integration
- [ ] Voice biometrics

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Contributors

- **Development Team** - Initial work and ongoing development
- **Community Contributors** - Bug fixes, features, and improvements

## 🙏 Acknowledgments

- **Groq** for providing the AI API
- **Web Speech API** community for voice technologies
- **Open source contributors** for various libraries used
- **Iron Man/Jarvis** for inspiration

## 📞 Support & Contact

- **Live Demo**: [https://rhyniox-ai.vercel.app/](https://rhyniox-ai.vercel.app/)
- **Backend API**: [https://rhyniox-ai.onrender.com/](https://rhyniox-ai.onrender.com/)
- **Issues**: [GitHub Issues](https://github.com/yagnarashagan6/Rhyniox-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yagnarashagan6/Rhyniox-AI/discussions)
- **Repository**: [https://github.com/yagnarashagan6/Rhyniox-AI](https://github.com/yagnarashagan6/Rhyniox-AI)

## 🌟 Show Your Support

If you found this project helpful, please:

- ⭐ **Star this repository**
- 🍴 **Fork and contribute**
- 🐛 **Report bugs**
- 💡 **Suggest features**
- 📢 **Share with others**

---

<div align="center">

**🤖 Made with ❤️ by the Rhyniox AI Team**

_Bringing the future of voice interaction to your browser_

[🌐 Live Demo](https://rhyniox-ai.vercel.app/) • [� Backend API](https://rhyniox-ai.onrender.com/) • [� GitHub Repository](https://github.com/yagnarashagan6/Rhyniox-AI)

</div>
