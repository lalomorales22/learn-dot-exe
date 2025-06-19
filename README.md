# LEARN.EXE 🎮
![Screenshot 2025-06-19 at 4 22 59 PM](https://github.com/user-attachments/assets/7bc9f659-48ae-4fd5-a493-5c6f80c9e6e3)

**AI-Powered Course Builder with Retro 8-Bit Design**

A modern learning application that combines the power of AI with nostalgic 8-bit aesthetics to create personalized, interactive learning experiences. Build comprehensive courses with AI tutoring capabilities that run locally on users' machines.


## 🚀 Features

- **AI-Powered Course Generation**: Leverages Groq's Qwen3-32B model for intelligent course design
- **Interactive Chat Interface**: Natural conversation with AI to understand learning needs
- **Retro 8-Bit Design**: Nostalgic terminal-style interface with scanlines and pixel-perfect styling
- **Personalized Learning Paths**: Customized courses based on skill level, duration, and focus areas
- **Modular Course Structure**: Organized learning chunks with estimated time and difficulty
- **Standalone Course Generation**: Creates downloadable HTML/CSS/JS learning applications
- **Local AI Tutor Integration**: Generated courses include Ollama-powered AI tutoring
- **Privacy-First**: All generated courses run locally with no external dependencies

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom retro styling
- **AI**: Groq API with Qwen3-32B model
- **Course Generation**: JSZip for creating downloadable course packages
- **Local AI**: Ollama integration for privacy-focused tutoring
- **Icons**: Lucide React
- **Font**: JetBrains Mono (retro terminal feel)

## 🎯 How It Works

1. **Chat with AI**: Tell the AI what you want to learn in natural language
2. **Course Analysis**: AI analyzes your needs and extracts key parameters
3. **Review & Customize**: Edit the generated course structure to your preferences
4. **Generate Learning App**: Create a comprehensive standalone course with modules and AI tutor
5. **Download & Learn**: Get a complete HTML application that works offline

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Groq API key (free at [console.groq.com](https://console.groq.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lalomorales22/learn-dot-exe.git
   cd learn-dot-exe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your Groq API key**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_actual_groq_api_key_here
   ```
   
   Get your free API key at: [https://console.groq.com/](https://console.groq.com/)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔐 Secure Deployment

### Option 1: Environment Variables (Recommended)

**For Netlify:**
1. Go to your site settings in Netlify
2. Navigate to "Environment variables"
3. Add: `VITE_GROQ_API_KEY` with your API key value
4. Redeploy your site

**For Vercel:**
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add: `VITE_GROQ_API_KEY` with your API key value
4. Redeploy your project

**For other platforms:**
- Add `VITE_GROQ_API_KEY` as an environment variable
- The app will automatically use it without exposing it in your code

### Option 2: Runtime Configuration

The app gracefully handles missing API keys by showing setup instructions to users, so you can deploy without the key and let users add their own.

## 🎮 Usage

### Creating a Course

1. **Start a Conversation**: Tell the AI what you want to learn
   - "I want to learn Python programming"
   - "Teach me quantum physics basics"
   - "Help me understand machine learning"

2. **AI Analysis**: The AI will ask clarifying questions and analyze your needs

3. **Review Parameters**: Check and edit the extracted course parameters:
   - Subject and learning objectives
   - Skill level (beginner/intermediate/advanced)
   - Course duration
   - Specific focus areas

4. **Generate Course**: Create your personalized learning experience

5. **Download & Use**: Get a complete standalone learning application

### Example Conversation

```
User: I want to learn web development, specifically React

AI: Great choice! React is a powerful library for building user interfaces. 
To create the perfect learning experience for you, I'd like to know:

1. What's your current programming experience?
2. How much time can you dedicate to learning?
3. Are there specific aspects of React you're most interested in?

User: I'm a beginner with basic HTML/CSS knowledge. I have about 2 hours 
per day for 6 weeks. I want to focus on building real projects.

AI: Perfect! I'll create a beginner-friendly React course focused on 
practical project building...

[Course analysis generated]
```

## 📦 Generated Course Features

Each generated course is a complete standalone web application that includes:

### 🎓 **Learning Features**
- **Interactive Modules**: Click-through lessons with progress tracking
- **Structured Content**: Organized topics with estimated completion times
- **Progress Tracking**: Visual progress bar and completion status
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🤖 **AI Tutor Integration**
- **Local AI Assistant**: Powered by Ollama (runs on user's machine)
- **Subject-Specific**: Specialized knowledge for the course topic
- **Conversation History**: Maintains context during learning sessions
- **Privacy-First**: No data sent to external servers

### 🔧 **Technical Features**
- **No Installation Required**: Just open index.html in any browser
- **Offline Capable**: Works without internet connection
- **Cross-Platform**: Compatible with Windows, Mac, Linux
- **Modern Browsers**: Supports Chrome, Firefox, Safari, Edge

## 🎨 Design Philosophy

LEARN.EXE embraces a retro 8-bit aesthetic that makes learning feel like an adventure:

- **Terminal-Style Interface**: Monospace fonts and command-line inspired design
- **Scanline Effects**: Subtle CRT monitor simulation
- **Pixel-Perfect Borders**: Sharp, geometric design elements
- **Retro Color Palette**: Blue, green, and amber terminal colors
- **Interactive Animations**: Smooth transitions and hover effects

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: Groq API key for AI functionality
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Customization

- **Styling**: Modify `src/index.css` for custom retro effects
- **AI Prompts**: Edit system prompts in `src/services/claudeService.ts`
- **Course Structure**: Customize the course generation logic in `src/services/courseGenerator.ts`

## 📁 Project Structure

```
learn-dot-exe/
├── src/
│   ├── services/
│   │   ├── claudeService.ts     # AI service integration
│   │   └── courseGenerator.ts   # Course file generation
│   ├── types/
│   │   └── course.ts            # TypeScript interfaces
│   ├── App.tsx                  # Main application component
│   ├── index.css               # Retro styling and animations
│   └── main.tsx                # Application entry point
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── index.html                 # HTML template
└── README.md                  # This file
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. **Connect to GitHub**: Link your repository to Netlify
2. **Set Environment Variables**: Add `VITE_GROQ_API_KEY` in site settings
3. **Deploy**: Netlify will automatically build and deploy

### Deploy to Vercel

1. **Connect to GitHub**: Import your repository to Vercel
2. **Set Environment Variables**: Add `VITE_GROQ_API_KEY` in project settings
3. **Deploy**: Vercel will automatically build and deploy

### Other Platforms

Most platforms support environment variables. Add `VITE_GROQ_API_KEY` to your deployment environment.

## 🎯 Generated Course Structure

Each course includes these files:

```
course-folder/
├── index.html              # Main course page
├── README.md               # Course-specific instructions
├── SETUP-GUIDE.md          # Detailed setup guide
├── styles/
│   └── main.css            # Course styling
├── js/
│   ├── main.js             # Course functionality
│   └── ollama-service.js   # AI tutor integration
└── data/
    └── course-data.json    # Course content and structure
```

## 🤖 Ollama Integration

Generated courses include local AI tutoring via Ollama:

### For Course Users:
1. **Install Ollama**: Download from [ollama.com](https://ollama.com)
2. **Pull a Model**: Run `ollama pull llama3` in terminal
3. **Open Course**: Double-click index.html
4. **Use AI Tutor**: Click the AI tutor button in the course

### Supported Models:
- **llama3**: General-purpose learning (recommended)
- **codellama**: Best for programming courses
- **mistral**: Fast responses for quick questions
- **phi3**: Lightweight option for basic concepts

## 🤝 Contributing

Contributions are welcome! Here are some areas for improvement:

- **Enhanced Course Templates**: Pre-built structures for common subjects
- **Interactive Visualizations**: D3.js or Three.js components
- **Assessment Tools**: Quizzes and knowledge checks
- **Progress Analytics**: Detailed learning insights
- **Mobile Optimization**: Enhanced mobile experience
- **Course Sharing**: Community course marketplace

### Development Guidelines

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Test your changes
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq**: For providing fast AI inference
- **Qwen Team**: For the excellent Qwen3-32B model
- **Ollama**: For enabling local AI deployment
- **Retro Computing Community**: For inspiration on 8-bit design
- **Educational Technology**: For advancing personalized learning

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/lalomorales22/learn-dot-exe/issues)
- **Discussions**: [Join the community](https://github.com/lalomorales22/learn-dot-exe/discussions)

---

**Built with ❤️ for learners everywhere**

*LEARN.EXE - Where AI meets retro gaming aesthetics to create the future of personalized education.*

## 🎬 Demo

Try the live demo: [LEARN.EXE Demo](https://marvelous-puffpuff-2b3ce0.netlify.app)

Create your first AI-powered course in minutes!