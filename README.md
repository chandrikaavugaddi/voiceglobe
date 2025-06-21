# VoiceGlobe - Speech Recognition Platform

A complete full-stack web application that allows users to speak in any language and get real-time speech-to-text transcription with a modern dark theme interface.

## 🌟 Features

- **Real-time Speech Recognition**: Uses Web Speech API for accurate speech-to-text conversion
- **Multi-language Support**: Supports 12+ languages for speech input
- **Full-Stack Architecture**: Express.js backend with static frontend
- **Production Ready**: Deployable to any hosting platform
- **Dark Mode UI**: Modern, professional Bootstrap 5 dark theme with white text
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error messages and user guidance

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Development Mode** (with auto-restart):
   ```bash
   npm run dev
   ```

4. **Open Browser**: Visit `http://localhost:3000`

### Production Deployment

#### Option 1: Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Option 2: Railway
```bash
# Install Railway CLI
railway login
railway init
railway up
```

#### Option 3: Render
1. Connect your GitHub repository
2. Select "Web Service"
3. Set build command: `npm install`
4. Set start command: `npm start`

#### Option 4: Vercel
```bash
# Install Vercel CLI
npm i -g vercel
vercel
```

#### Option 5: DigitalOcean App Platform
1. Connect your GitHub repository
2. Select "Web Service"
3. Set build command: `npm install`
4. Set run command: `npm start`

## 📋 Prerequisites

- **Node.js**: 14.0.0 or higher
- **Browser**: Chrome 66+ or Edge 79+ (for Web Speech API support)
- **Microphone**: Working microphone for speech input

## 🛠️ Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd voiceglobe
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup** (optional):
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the Application**:
   ```bash
   npm start
   ```

## 🎯 How to Use

### Basic Usage
1. **Select Input Language**: Choose the language you'll be speaking
2. **Click "Start Speaking"**: Allow microphone access when prompted
3. **Speak Clearly**: Your speech will be transcribed in real-time
4. **View Results**: Speech appears in white text on dark background

### Keyboard Shortcuts
- `Ctrl + Space`: Start/Stop speech recognition
- `Ctrl + Shift + C`: Clear all content

### Supported Languages
- English (US)
- Spanish
- French
- German
- Italian
- Portuguese (Brazil)
- Russian
- Japanese
- Korean
- Chinese (Simplified)
- Hindi
- Arabic

## 🔧 Technical Architecture

### Frontend
- **HTML5**: Semantic markup with Bootstrap 5
- **CSS3**: Custom dark theme with white text and responsive design
- **JavaScript (ES6+)**: Speech recognition integration
- **Bootstrap 5.3.0**: UI framework and components
- **Web Speech API**: Browser-based speech recognition

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Compression**: Response compression

## 📁 Project Structure

```
voiceglobe/
├── public/                 # Static frontend files
│   ├── index.html         # Main HTML file
│   ├── style.css          # Custom styles with white text
│   └── script.js          # Frontend JavaScript
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── Procfile              # Heroku deployment
├── env.example           # Environment variables template
└── README.md             # Documentation
```

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Server health status

## 🔒 Security & Privacy

- **No Data Storage**: All processing happens in memory
- **CORS Enabled**: Secure cross-origin requests
- **Security Headers**: Helmet.js protection
- **No External APIs**: All processing is client-side

## 🐛 Troubleshooting

### Common Issues

**"Speech recognition is not supported"**
- Use Chrome or Edge browser
- Ensure you're on HTTPS or localhost

**"Microphone access denied"**
- Click the microphone icon in the address bar
- Allow microphone access
- Check browser settings

**"No speech detected"**
- Speak more clearly and loudly
- Check microphone settings
- Ensure quiet environment

**"Server not responding"**
- Verify the server is running (`npm start`)
- Check port availability
- Review environment variables

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start
```

## 📱 Mobile Usage

The application is fully responsive and works on mobile devices:
- Touch-friendly interface
- Optimized for small screens
- Works with mobile microphones
- Responsive design adapts to screen size

## 🚀 Deployment Platforms

### Supported Platforms
- ✅ Heroku
- ✅ Railway
- ✅ Render
- ✅ Vercel
- ✅ DigitalOcean App Platform
- ✅ AWS Elastic Beanstalk
- ✅ Google Cloud Run
- ✅ Azure App Service

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Avugaddi Chandrika**
- Created: June 21, 2025
- Version: 1.0

## 🙏 Acknowledgments

- **Web Speech API**: For speech recognition capabilities
- **Express.js**: For the backend framework
- **Bootstrap**: For responsive UI framework

## 📞 Support

For issues, questions, or suggestions:
1. Check the troubleshooting section above
2. Review browser compatibility requirements
3. Ensure all prerequisites are met
4. Test with different browsers if needed

---

**Note**: This application uses the Web Speech API which is supported in Chrome and Edge browsers. For production use, ensure your users have compatible browsers. 