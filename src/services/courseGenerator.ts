import JSZip from 'jszip';
import { CourseStructure, CourseInput } from '../types/course';

export class CourseGenerator {
  constructor(
    private courseStructure: CourseStructure,
    private courseInput: CourseInput
  ) {}

  async generateCourseFiles(): Promise<Blob> {
    const zip = new JSZip();

    // Generate all course files for a standalone web application
    await this.generateIndexHTML(zip);
    await this.generateMainCSS(zip);
    await this.generateMainJS(zip);
    await this.generateOllamaService(zip);
    await this.generateCourseData(zip);
    await this.generateReadme(zip);
    await this.generateSetupGuide(zip);

    return await zip.generateAsync({ type: 'blob' });
  }

  private async generateIndexHTML(zip: JSZip): Promise<void> {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.courseStructure.title}</title>
    <link rel="stylesheet" href="styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="scanlines"></div>
    
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1 class="title">${this.courseStructure.title}</h1>
                <p class="subtitle">${this.courseStructure.subtitle}</p>
                <div class="course-stats">
                    <span class="stat">◆ ${this.courseStructure.totalChunks} MODULES</span>
                    <span class="stat">◆ ${this.courseStructure.estimatedHours} HOURS</span>
                    <span class="stat">◆ ${this.courseStructure.difficulty} LEVEL</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <div class="course-layout">
                <!-- Course Modules -->
                <div class="modules-section">
                    <h2 class="section-title">📚 COURSE MODULES</h2>
                    <div class="modules-grid" id="modulesGrid">
                        <!-- Modules will be loaded here -->
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="progress-section">
                    <h3 class="section-title">📊 YOUR PROGRESS</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-text" id="progressText">0% Complete</div>
                </div>
            </div>
        </div>
    </main>

    <!-- AI Assistant Sidebar -->
    <div class="ai-sidebar" id="aiSidebar">
        <div class="ai-header">
            <h3>🤖 AI TUTOR</h3>
            <button class="close-btn" id="closeSidebar">✕</button>
        </div>
        
        <div class="ai-status" id="aiStatus">
            <div class="status-indicator offline" id="statusIndicator"></div>
            <span id="statusText">Connecting to Ollama...</span>
        </div>

        <div class="ai-chat" id="aiChat">
            <div class="chat-messages" id="chatMessages">
                <div class="ai-message">
                    <div class="message-content">
                        Hello! I'm your AI tutor for ${this.courseInput.subject}. I'm powered by Ollama running locally on your machine. Ask me anything about the course material!
                    </div>
                </div>
            </div>
            
            <div class="chat-input-area">
                <textarea 
                    id="chatInput" 
                    placeholder="Ask me about ${this.courseInput.subject}..."
                    rows="2"
                ></textarea>
                <button id="sendMessage" class="send-btn">SEND</button>
            </div>
        </div>

        <div class="ai-settings">
            <h4>⚙️ SETTINGS</h4>
            <div class="setting-group">
                <label for="modelSelect">Model:</label>
                <select id="modelSelect">
                    <!-- Models loaded dynamically -->
                </select>
            </div>
            <div class="setting-group">
                <label for="temperatureSlider">Temperature: <span id="tempValue">0.7</span></label>
                <input type="range" id="temperatureSlider" min="0" max="1" step="0.1" value="0.7">
            </div>
        </div>
    </div>

    <!-- AI Toggle Button -->
    <button class="ai-toggle" id="aiToggle">
        🤖 AI TUTOR
    </button>

    <!-- Module Modal -->
    <div class="modal" id="moduleModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Module Title</h3>
                <button class="close-btn" id="closeModal">✕</button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Module content will be loaded here -->
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevModule">◀ PREVIOUS</button>
                <button class="btn btn-primary" id="markComplete">MARK COMPLETE</button>
                <button class="btn btn-secondary" id="nextModule">NEXT ▶</button>
            </div>
        </div>
    </div>

    <script src="js/ollama-service.js"></script>
    <script src="js/main.js"></script>
</body>
</html>`;

    zip.file('index.html', html);
  }

  private async generateMainCSS(zip: JSZip): Promise<void> {
    const css = `/* LEARN.EXE Course Styles */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

:root {
    --primary-blue: #3b82f6;
    --primary-blue-dark: #1d4ed8;
    --accent-green: #10b981;
    --accent-yellow: #f59e0b;
    --accent-red: #ef4444;
    --accent-purple: #8b5cf6;
    --bg-black: #000000;
    --bg-gray-900: #111827;
    --bg-gray-800: #1f2937;
    --bg-gray-700: #374151;
    --text-white: #ffffff;
    --text-gray-300: #d1d5db;
    --text-gray-400: #9ca3af;
    --border-blue: #60a5fa;
    --border-green: #34d399;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'JetBrains Mono', monospace;
    background: var(--bg-black);
    color: var(--text-white);
    overflow-x: hidden;
    line-height: 1.6;
}

/* Scanlines Effect */
.scanlines {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1000;
    background: linear-gradient(
        transparent 0%,
        rgba(0, 255, 0, 0.02) 50%,
        transparent 100%
    );
    background-size: 100% 4px;
    animation: scanlines 0.1s linear infinite;
    opacity: 0.5;
}

@keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
}

/* Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: var(--bg-gray-900);
    border-bottom: 2px solid var(--primary-blue);
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    text-align: center;
}

.title {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-blue);
    margin-bottom: 8px;
}

.subtitle {
    font-size: 1.1rem;
    color: var(--text-gray-300);
    margin-bottom: 12px;
}

.course-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.stat {
    font-size: 0.9rem;
    color: var(--accent-green);
}

/* Main Content */
.main-content {
    padding: 40px 0;
    min-height: calc(100vh - 200px);
}

.course-layout {
    display: grid;
    gap: 40px;
}

.section-title {
    font-size: 1.5rem;
    color: var(--primary-blue);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Modules Grid */
.modules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.module-card {
    background: var(--bg-gray-900);
    border: 2px solid var(--primary-blue);
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.module-card:hover {
    border-color: var(--accent-green);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.module-card.completed {
    border-color: var(--accent-green);
    background: var(--bg-gray-800);
}

.module-card.completed::after {
    content: '✓';
    position: absolute;
    top: 10px;
    right: 15px;
    color: var(--accent-green);
    font-size: 1.2rem;
    font-weight: bold;
}

.module-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--accent-green);
    margin-bottom: 10px;
}

.module-meta {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 0.8rem;
}

.meta-tag {
    padding: 4px 8px;
    border: 1px solid;
    font-size: 0.7rem;
}

.meta-tag.difficulty {
    color: var(--primary-blue);
    border-color: var(--primary-blue);
}

.meta-tag.time {
    color: var(--accent-yellow);
    border-color: var(--accent-yellow);
}

.module-topics {
    list-style: none;
}

.module-topics li {
    font-size: 0.9rem;
    color: var(--text-gray-300);
    margin-bottom: 5px;
}

.module-topics li::before {
    content: '▸ ';
    color: var(--primary-blue);
    margin-right: 5px;
}

/* Progress Section */
.progress-section {
    background: var(--bg-gray-900);
    border: 2px solid var(--accent-purple);
    padding: 20px;
    margin-top: 20px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: var(--bg-gray-800);
    border: 2px solid var(--text-gray-400);
    margin-bottom: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-green), var(--primary-blue));
    width: 0%;
    transition: width 0.5s ease;
}

.progress-text {
    text-align: center;
    font-weight: bold;
    color: var(--accent-green);
}

/* AI Assistant Sidebar */
.ai-sidebar {
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: var(--bg-gray-900);
    border-left: 2px solid var(--accent-green);
    z-index: 200;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
}

.ai-sidebar.open {
    right: 0;
}

.ai-header {
    padding: 20px;
    border-bottom: 2px solid var(--accent-green);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ai-header h3 {
    color: var(--accent-green);
    font-size: 1.2rem;
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-white);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
}

.close-btn:hover {
    color: var(--accent-red);
}

.ai-status {
    padding: 15px 20px;
    border-bottom: 1px solid var(--bg-gray-700);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent-red);
}

.status-indicator.online {
    background: var(--accent-green);
    animation: pulse 2s infinite;
}

.status-indicator.offline {
    background: var(--accent-red);
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.ai-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.ai-message, .user-message {
    padding: 12px;
    border: 1px solid;
    font-size: 0.9rem;
    line-height: 1.4;
}

.ai-message {
    background: var(--bg-gray-800);
    border-color: var(--accent-green);
    color: var(--text-gray-300);
}

.user-message {
    background: var(--bg-gray-700);
    border-color: var(--primary-blue);
    color: var(--text-white);
    align-self: flex-end;
    max-width: 80%;
}

.message-content {
    white-space: pre-wrap;
}

.chat-input-area {
    padding: 20px;
    border-top: 1px solid var(--bg-gray-700);
    display: flex;
    gap: 10px;
}

#chatInput {
    flex: 1;
    background: var(--bg-black);
    border: 2px solid var(--text-gray-400);
    color: var(--text-white);
    padding: 10px;
    font-family: inherit;
    font-size: 0.9rem;
    resize: none;
}

#chatInput:focus {
    outline: none;
    border-color: var(--primary-blue);
}

.send-btn {
    background: var(--accent-green);
    border: 2px solid var(--accent-green);
    color: var(--text-white);
    padding: 10px 15px;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}

.send-btn:hover {
    background: var(--bg-gray-700);
}

.send-btn:disabled {
    background: var(--bg-gray-700);
    border-color: var(--text-gray-400);
    color: var(--text-gray-400);
    cursor: not-allowed;
}

.ai-settings {
    padding: 20px;
    border-top: 1px solid var(--bg-gray-700);
    background: var(--bg-gray-800);
}

.ai-settings h4 {
    color: var(--accent-yellow);
    margin-bottom: 15px;
    font-size: 1rem;
}

.setting-group {
    margin-bottom: 15px;
}

.setting-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: var(--text-gray-300);
}

.setting-group select,
.setting-group input[type="range"] {
    width: 100%;
    background: var(--bg-black);
    border: 1px solid var(--text-gray-400);
    color: var(--text-white);
    padding: 8px;
    font-family: inherit;
}

.setting-group select:focus,
.setting-group input:focus {
    outline: none;
    border-color: var(--primary-blue);
}

/* AI Toggle Button */
.ai-toggle {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: var(--accent-green);
    border: 2px solid var(--accent-green);
    color: var(--text-white);
    padding: 15px 10px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
    z-index: 150;
    transition: all 0.3s ease;
}

.ai-toggle:hover {
    background: var(--bg-gray-700);
    transform: translateY(-50%) translateX(-5px);
}

.ai-toggle.hidden {
    right: -100px;
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 300;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal.open {
    display: flex;
}

.modal-content {
    background: var(--bg-gray-900);
    border: 2px solid var(--primary-blue);
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 20px;
    border-bottom: 2px solid var(--primary-blue);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    color: var(--primary-blue);
    font-size: 1.3rem;
}

.modal-body {
    padding: 30px;
    overflow-y: auto;
    flex: 1;
}

.modal-footer {
    padding: 20px;
    border-top: 2px solid var(--primary-blue);
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

/* Buttons */
.btn {
    padding: 12px 20px;
    border: 2px solid;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;
}

.btn-primary {
    color: var(--accent-green);
    border-color: var(--accent-green);
}

.btn-primary:hover {
    background: var(--accent-green);
    color: var(--bg-black);
}

.btn-secondary {
    color: var(--text-gray-300);
    border-color: var(--text-gray-400);
}

.btn-secondary:hover {
    background: var(--text-gray-400);
    color: var(--bg-black);
}

/* Module Content Styles */
.module-content h1, .module-content h2, .module-content h3 {
    color: var(--primary-blue);
    margin: 20px 0 10px 0;
}

.module-content h1 {
    font-size: 1.8rem;
    border-bottom: 2px solid var(--primary-blue);
    padding-bottom: 10px;
}

.module-content h2 {
    font-size: 1.4rem;
    color: var(--accent-green);
}

.module-content h3 {
    font-size: 1.2rem;
    color: var(--accent-yellow);
}

.module-content p {
    margin-bottom: 15px;
    color: var(--text-gray-300);
    line-height: 1.6;
}

.module-content ul, .module-content ol {
    margin: 15px 0;
    padding-left: 20px;
    color: var(--text-gray-300);
}

.module-content li {
    margin-bottom: 8px;
}

.module-content code {
    background: var(--bg-black);
    border: 1px solid var(--text-gray-400);
    padding: 2px 6px;
    font-family: inherit;
    color: var(--accent-green);
}

.module-content pre {
    background: var(--bg-black);
    border: 2px solid var(--text-gray-400);
    padding: 15px;
    overflow-x: auto;
    margin: 15px 0;
}

.module-content pre code {
    border: none;
    padding: 0;
    background: none;
}

.concept-box {
    background: var(--bg-gray-800);
    border: 2px solid var(--accent-purple);
    padding: 20px;
    margin: 20px 0;
}

.concept-box h4 {
    color: var(--accent-purple);
    margin-bottom: 10px;
}

.example-box {
    background: var(--bg-gray-800);
    border: 2px solid var(--accent-yellow);
    padding: 20px;
    margin: 20px 0;
}

.example-box h4 {
    color: var(--accent-yellow);
    margin-bottom: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .ai-sidebar {
        width: 100%;
        right: -100%;
    }
    
    .ai-toggle {
        right: 10px;
        padding: 10px 8px;
        font-size: 0.9rem;
    }
    
    .modules-grid {
        grid-template-columns: 1fr;
    }
    
    .title {
        font-size: 2rem;
    }
    
    .course-stats {
        flex-direction: column;
        gap: 10px;
    }
    
    .modal-content {
        margin: 10px;
        max-height: 95vh;
    }
    
    .modal-footer {
        flex-direction: column;
    }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-gray-800);
}

::-webkit-scrollbar-thumb {
    background: var(--primary-blue);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-blue-dark);
}

/* Loading Animation */
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--text-gray-400);
    border-radius: 50%;
    border-top-color: var(--accent-green);
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Typing Animation */
.typing::after {
    content: '|';
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}`;

    zip.folder('styles')?.file('main.css', css);
  }

  private async generateOllamaService(zip: JSZip): Promise<void> {
    const js = `// Ollama Service for Local AI Assistant
class OllamaService {
    constructor() {
        this.baseUrl = 'http://localhost:11434';
        this.currentModel = 'llama3'; // A sensible default
        this.temperature = 0.7;
        this.isConnected = false;
        this.conversationHistory = [];
        
        this.init();
    }

    async init() {
        await this.checkConnection();
        await this.loadAvailableModels();
        this.setupSystemPrompt();
    }

    async checkConnection() {
        try {
            const response = await fetch(\`\${this.baseUrl}/api/version\`);
            if (response.ok) {
                this.isConnected = true;
                this.updateStatus('online', 'Connected to Ollama');
                console.log('✅ Connected to Ollama');
            } else {
                throw new Error('Ollama not responding');
            }
        } catch (error) {
            this.isConnected = false;
            this.updateStatus('offline', 'Ollama not running');
            console.log('❌ Ollama connection failed:', error.message);
            this.showConnectionHelp();
        }
    }

    async loadAvailableModels() {
        if (!this.isConnected) return;

        try {
            const response = await fetch(\`\${this.baseUrl}/api/tags\`);
            if (response.ok) {
                const data = await response.json();
                this.updateModelSelect(data.models || []);
            }
        } catch (error) {
            console.log('Failed to load models:', error);
        }
    }

    setupSystemPrompt() {
        const courseSubject = '${this.courseInput.subject}';
        const skillLevel = '${this.courseInput.skillLevel}';
        
        this.systemPrompt = \`You are an expert \${courseSubject} tutor for a \${skillLevel} student. You are part of an interactive learning course called "${this.courseStructure.title}".

Your role:
- Help students understand \${courseSubject} concepts clearly and thoroughly
- Provide practical examples and real-world applications
- Break down complex topics into digestible parts
- Encourage questions and curiosity
- Adapt explanations to the \${skillLevel} level
- Be patient, encouraging, and supportive

Course Context:
- Subject: \${courseSubject}
- Level: \${skillLevel}
- Focus Areas: ${this.courseInput.focusAreas.join(', ')}

Guidelines:
- Keep responses concise but comprehensive
- Use examples relevant to the course material
- Encourage hands-on practice when applicable
- If asked about topics outside \${courseSubject}, gently redirect to course content
- Use a friendly, encouraging tone
- Format code examples clearly when relevant\`;

        this.conversationHistory = [{
            role: 'system',
            content: this.systemPrompt
        }];
    }

    async sendMessage(userMessage) {
        if (!this.isConnected) {
            throw new Error('Not connected to Ollama. Please ensure Ollama is running.');
        }

        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            const response = await fetch(\`\${this.baseUrl}/api/chat\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.currentModel,
                    messages: this.conversationHistory,
                    stream: false,
                    options: {
                        temperature: this.temperature
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from Ollama');
            }

            const data = await response.json();
            const assistantMessage = data.message.content;

            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return assistantMessage;
        } catch (error) {
            console.error('Ollama API Error:', error);
            throw error;
        }
    }

    setModel(modelName) {
        this.currentModel = modelName;
        console.log(\`Switched to model: \${modelName}\`);
    }

    setTemperature(temp) {
        this.temperature = parseFloat(temp);
        console.log(\`Temperature set to: \${this.temperature}\`);
    }

    updateStatus(status, message) {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (statusIndicator && statusText) {
            statusIndicator.className = \`status-indicator \${status}\`;
            statusText.textContent = message;
        }
    }

    updateModelSelect(models) {
        const modelSelect = document.getElementById('modelSelect');
        if (!modelSelect) return;

        modelSelect.innerHTML = '';

        if (models.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No models found';
            modelSelect.appendChild(option);
            return;
        }
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.name;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });

        if (models.find(m => m.name.includes(this.currentModel))) {
            const bestMatch = models.find(m => m.name.includes(this.currentModel)).name;
            modelSelect.value = bestMatch;
            this.currentModel = bestMatch;
        } else {
             this.currentModel = models[0].name;
             modelSelect.value = this.currentModel;
        }
    }

    showConnectionHelp() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const helpMessage = document.createElement('div');
        helpMessage.className = 'ai-message';
        helpMessage.innerHTML = \`
            <div class="message-content">
                <strong>🔧 Ollama Setup Required</strong><br><br>
                To use the AI tutor, you need to install and run Ollama:<br><br>
                <strong>1. Install Ollama:</strong><br>
                • Visit: <a href="https://ollama.com" target="_blank" style="color: #3b82f6;">https://ollama.com</a><br>
                • Download for your OS<br><br>
                <strong>2. Pull a model via your terminal:</strong><br>
                • Run: <code style="background: #000; padding: 2px 4px; color: #10b981;">ollama pull llama3</code><br><br>
                <strong>3. Ensure Ollama is running.</strong><br><br>
                Once Ollama is running, refresh this page!
            </div>
        \`;
        
        chatMessages.appendChild(helpMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Export for use in main.js
window.OllamaService = OllamaService;`;

    zip.folder('js')?.file('ollama-service.js', js);
  }

  private async generateMainJS(zip: JSZip): Promise<void> {
    const js = `// Main Course Application
class CourseApp {
    constructor() {
        this.courseData = null;
        this.currentModule = 0;
        this.completedModules = new Set();
        this.ollamaService = null;
        
        this.init();
    }

    async init() {
        await this.loadCourseData();
        this.initializeOllama();
        this.renderModules();
        this.setupEventListeners();
        this.loadProgress();
        this.updateProgress();
    }

    async loadCourseData() {
        try {
            const response = await fetch('data/course-data.json');
            this.courseData = await response.json();
        } catch (error) {
            console.error('Failed to load course data:', error);
        }
    }

    initializeOllama() {
        this.ollamaService = new OllamaService();
    }

    renderModules() {
        const modulesGrid = document.getElementById('modulesGrid');
        if (!modulesGrid || !this.courseData) return;

        modulesGrid.innerHTML = '';

        this.courseData.chunks.forEach((chunk, index) => {
            const moduleCard = document.createElement('div');
            moduleCard.className = \`module-card \${this.completedModules.has(index) ? 'completed' : ''}\`;
            moduleCard.dataset.moduleIndex = index;

            moduleCard.innerHTML = \`
                <div class="module-title">\${chunk.title}</div>
                <div class="module-meta">
                    <span class="meta-tag difficulty">\${chunk.difficulty}</span>
                    <span class="meta-tag time">\${chunk.estimatedTime}</span>
                </div>
                <ul class="module-topics">
                    \${chunk.topics.map(topic => \`<li>\${topic}</li>\`).join('')}
                </ul>
                <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-gray-400);">
                    \${chunk.concepts} key concepts
                </div>
            \`;

            moduleCard.addEventListener('click', () => this.openModule(index));
            modulesGrid.appendChild(moduleCard);
        });
    }

    setupEventListeners() {
        // AI Toggle
        const aiToggle = document.getElementById('aiToggle');
        const aiSidebar = document.getElementById('aiSidebar');
        const closeSidebar = document.getElementById('closeSidebar');

        aiToggle?.addEventListener('click', () => {
            aiSidebar?.classList.add('open');
            aiToggle?.classList.add('hidden');
        });

        closeSidebar?.addEventListener('click', () => {
            aiSidebar?.classList.remove('open');
            aiToggle?.classList.remove('hidden');
        });

        // Chat functionality
        const sendMessage = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');

        sendMessage?.addEventListener('click', () => this.sendChatMessage());
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });

        // Settings
        const modelSelect = document.getElementById('modelSelect');
        const temperatureSlider = document.getElementById('temperatureSlider');
        const tempValue = document.getElementById('tempValue');

        modelSelect?.addEventListener('change', (e) => {
            this.ollamaService?.setModel(e.target.value);
        });

        temperatureSlider?.addEventListener('input', (e) => {
            const temp = e.target.value;
            tempValue.textContent = temp;
            this.ollamaService?.setTemperature(temp);
        });

        // Modal controls
        const closeModal = document.getElementById('closeModal');
        const prevModule = document.getElementById('prevModule');
        const nextModule = document.getElementById('nextModule');
        const markComplete = document.getElementById('markComplete');

        closeModal?.addEventListener('click', () => this.closeModal());
        prevModule?.addEventListener('click', () => this.navigateModule(-1));
        nextModule?.addEventListener('click', () => this.navigateModule(1));
        markComplete?.addEventListener('click', () => this.markModuleComplete());

        const modal = document.getElementById('moduleModal');
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');

        if (!chatInput || !this.ollamaService) return;

        const message = chatInput.value.trim();
        if (!message) return;

        chatInput.disabled = true;
        sendButton.disabled = true;
        sendButton.innerHTML = '<div class="loading"></div>';

        this.addChatMessage(message, 'user');
        chatInput.value = '';

        try {
            const response = await this.ollamaService.sendMessage(message);
            this.addChatMessage(response, 'ai');
        } catch (error) {
            this.addChatMessage(\`Sorry, I encountered an error: \${error.message}\`, 'ai');
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            sendButton.textContent = 'SEND';
            chatInput.focus();
        }
    }

    addChatMessage(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    openModule(index) {
        if (!this.courseData || !this.courseData.chunks[index]) return;

        this.currentModule = index;
        const chunk = this.courseData.chunks[index];
        
        const modal = document.getElementById('moduleModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = chunk.title;
        modalBody.innerHTML = this.generateModuleContent(chunk, index);
        
        this.updateModalNavigation();
        
        modal.classList.add('open');
    }

    generateModuleContent(chunk, index) {
        return \`
            <div class="module-content">
                <h1>\${chunk.title}</h1>
                
                <div class="concept-box">
                    <h4>📚 Module Overview</h4>
                    <p><strong>Difficulty:</strong> \${chunk.difficulty}</p>
                    <p><strong>Estimated Time:</strong> \${chunk.estimatedTime}</p>
                    <p><strong>Key Concepts:</strong> \${chunk.concepts}</p>
                </div>

                <h2>🎯 Learning Objectives</h2>
                <p>By the end of this module, you will understand:</p>
                <ul>
                    \${chunk.topics.map(topic => \`<li>\${topic}</li>\`).join('')}
                </ul>

                <h2>📖 Content</h2>
                \${this.generateDetailedContent(chunk, index)}

                <div class="example-box">
                    <h4>💡 Quick Tip</h4>
                    <p>Use the AI tutor on the right to ask questions about any concept in this module. The AI is specialized in \${this.courseData.subject} and can provide personalized explanations!</p>
                </div>

                <h2>🔍 Key Takeaways</h2>
                <ul>
                    \${chunk.topics.map(topic => \`<li>Understanding of \${topic.toLowerCase()}</li>\`).join('')}
                </ul>
            </div>
        \`;
    }

    generateDetailedContent(chunk, index) {
        const subject = this.courseData.subject.toLowerCase();
        let content = '';

        chunk.topics.forEach((topic, topicIndex) => {
            content += \`
                <h3>\${topicIndex + 1}. \${topic}</h3>
                <p>This section covers \${topic.toLowerCase()} in the context of \${subject}. Understanding this concept is crucial for mastering \${subject}.</p>
                
                \${this.generateTopicContent(topic, subject)}
                
                <div class="concept-box">
                    <h4>🔑 Key Concept</h4>
                    <p>Remember: \${topic} is fundamental to understanding \${subject}. Take time to practice and experiment with these concepts.</p>
                </div>
            \`;
        });

        return content;
    }

    generateTopicContent(topic, subject) {
        if (subject.includes('programming') || subject.includes('code')) {
            return \`
                <p>Let's explore \${topic} with practical examples:</p>
                <pre><code>// Example code for \${topic}
// This demonstrates key concepts in \${subject}
console.log("Learning \${topic}");
</code></pre>
                <p>Practice implementing this concept in your own projects to reinforce your understanding.</p>
            \`;
        } else if (subject.includes('math') || subject.includes('physics')) {
            return \`
                <p>The mathematical foundation of \${topic} includes:</p>
                <ul>
                    <li>Core principles and formulas</li>
                    <li>Real-world applications</li>
                    <li>Problem-solving strategies</li>
                </ul>
                <p>Work through practice problems to strengthen your grasp of these concepts.</p>
            \`;
        } else {
            return \`
                <p>Key aspects of \${topic} include:</p>
                <ul>
                    <li>Fundamental principles</li>
                    <li>Practical applications</li>
                    <li>Common misconceptions to avoid</li>
                    <li>Connections to other topics</li>
                </ul>
                <p>Consider how \${topic} relates to your existing knowledge and experience.</p>
            \`;
        }
    }

    updateModalNavigation() {
        const prevButton = document.getElementById('prevModule');
        const nextButton = document.getElementById('nextModule');
        const markCompleteButton = document.getElementById('markComplete');

        if (prevButton) {
            prevButton.disabled = this.currentModule === 0;
        }

        if (nextButton) {
            nextButton.disabled = this.currentModule === this.courseData.chunks.length - 1;
        }

        if (markCompleteButton) {
            const isCompleted = this.completedModules.has(this.currentModule);
            markCompleteButton.textContent = isCompleted ? 'COMPLETED ✓' : 'MARK COMPLETE';
            markCompleteButton.disabled = isCompleted;
        }
    }

    navigateModule(direction) {
        const newIndex = this.currentModule + direction;
        if (newIndex >= 0 && newIndex < this.courseData.chunks.length) {
            this.openModule(newIndex);
        }
    }

    markModuleComplete() {
        this.completedModules.add(this.currentModule);
        this.saveProgress();
        this.updateProgress();
        this.renderModules();
        this.updateModalNavigation();
    }

    closeModal() {
        const modal = document.getElementById('moduleModal');
        modal?.classList.remove('open');
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!progressFill || !progressText || !this.courseData) return;

        const totalModules = this.courseData.chunks.length;
        const completedCount = this.completedModules.size;
        const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

        progressFill.style.width = \`\${percentage}%\`;
        progressText.textContent = \`\${percentage}% Complete (\${completedCount}/\${totalModules} modules)\`;
    }

    saveProgress() {
        const progress = {
            completedModules: Array.from(this.completedModules),
            lastAccessed: new Date().toISOString()
        };
        localStorage.setItem('course-progress', JSON.stringify(progress));
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('course-progress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.completedModules = new Set(progress.completedModules || []);
            }
        } catch (error) {
            console.log('No saved progress found');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CourseApp();
});`;

    zip.folder('js')?.file('main.js', js);
  }

  private async generateCourseData(zip: JSZip): Promise<void> {
    const courseData = {
      title: this.courseStructure.title,
      subtitle: this.courseStructure.subtitle,
      subject: this.courseInput.subject,
      skillLevel: this.courseInput.skillLevel,
      duration: this.courseInput.duration,
      focusAreas: this.courseInput.focusAreas,
      totalChunks: this.courseStructure.totalChunks,
      estimatedHours: this.courseStructure.estimatedHours,
      difficulty: this.courseStructure.difficulty,
      chunks: this.courseStructure.chunks,
      visualizations: this.courseStructure.visualizations,
      aiPrompt: this.courseStructure.aiPrompt,
      generatedAt: new Date().toISOString()
    };

    zip.folder('data')?.file('course-data.json', JSON.stringify(courseData, null, 2));
  }

  private async generateReadme(zip: JSZip): Promise<void> {
    const readme = `# ${this.courseStructure.title}

**${this.courseStructure.subtitle}**

An interactive learning course for ${this.courseInput.subject} with AI-powered tutoring running locally on your machine via Ollama.

## 🚀 Quick Start

**This is a standalone web application - no npm or Node.js required!**

1. **Extract the files** from this ZIP to a folder on your computer
2. **Double-click \`index.html\`** to open the course in your web browser
3. **For AI Tutor**: Install Ollama and pull a model (see setup below)

## 📚 Course Information

- **Subject**: ${this.courseInput.subject}
- **Skill Level**: ${this.courseInput.skillLevel}
- **Duration**: ${this.courseInput.duration}
- **Modules**: ${this.courseStructure.totalChunks}
- **Estimated Hours**: ${this.courseStructure.estimatedHours}

### Focus Areas
${this.courseInput.focusAreas.map(area => `- ${area}`).join('\n')}

## 🤖 AI Tutor Setup (Optional)

The course includes an AI tutor powered by Ollama. This ensures your learning conversations stay private on your machine.

### Installation Steps:

1. **Install Ollama**: Visit [https://ollama.com](https://ollama.com) and download for your OS
2. **Pull a model**: Open terminal and run:
   \`\`\`bash
   ollama pull llama3
   \`\`\`
3. **Ensure Ollama is running** (it usually starts automatically)
4. **Refresh the course page** - the AI tutor will connect automatically

### Recommended Models:
- **llama3**: Great general-purpose model for most subjects
- **mistral**: Fast and efficient for quick questions  
- **codellama**: Best for programming and technical subjects
- **phi3**: Lightweight option for basic questions

## 📁 File Structure

\`\`\`
course-folder/
├── index.html          # Main course page (double-click to open)
├── README.md           # This file
├── SETUP-GUIDE.md      # Detailed setup instructions
├── styles/
│   └── main.css        # Course styling
├── js/
│   ├── main.js         # Course functionality
│   └── ollama-service.js # AI tutor integration
└── data/
    └── course-data.json # Course content and structure
\`\`\`

## 🎯 How to Use

1. **Open the course**: Double-click \`index.html\`
2. **Browse modules**: Click on any module card to start learning
3. **Track progress**: Complete modules to see your progress
4. **Use AI tutor**: Click the "🤖 AI TUTOR" button on the right
5. **Ask questions**: Chat with the AI about any course topic

## 🔒 Privacy & Security

- **100% Local**: All data stays on your machine
- **No cloud services**: No external API calls (except to local Ollama)
- **Private conversations**: AI chats are not stored or transmitted
- **Local progress**: Your progress is saved in browser storage

## 🛠️ Troubleshooting

### Course won't open:
- Make sure you're opening \`index.html\` in a web browser
- Try a different browser (Chrome, Firefox, Safari, Edge)

### AI Tutor not working:
- Install Ollama from [https://ollama.com](https://ollama.com)
- Run \`ollama pull llama3\` in terminal
- Ensure Ollama is running (check system tray/menu bar)
- Refresh the course page

### Progress not saving:
- Make sure you're allowing local storage in your browser
- Don't use private/incognito mode for persistent progress

## 🎨 Features

- ✅ Interactive module navigation
- ✅ Progress tracking (saved locally)
- ✅ AI tutor with conversation history
- ✅ Responsive retro design
- ✅ Works offline (after initial load)
- ✅ No installation required
- ✅ Cross-platform compatibility

## 🌐 Browser Compatibility

Works in all modern browsers:
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

**Generated by LEARN.EXE** - AI-Powered Course Builder  
*Created on ${new Date().toLocaleDateString()}*

**Need help?** Check the SETUP-GUIDE.md file for detailed instructions.`;

    zip.file('README.md', readme);
  }

  private async generateSetupGuide(zip: JSZip): Promise<void> {
    const setupGuide = `# 📖 SETUP GUIDE

## Getting Started with Your Course

This is a **standalone web application** that runs directly in your browser. No complex setup required!

### ⚡ Quick Start (2 minutes)

1. **Extract the ZIP file** to any folder on your computer
2. **Double-click \`index.html\`** 
3. **Start learning!** 🎉

That's it! Your course is now running.

---

## 🤖 Setting Up the AI Tutor (Optional)

The AI tutor provides personalized help and answers questions about your course material. It runs locally on your machine for complete privacy.

### Step 1: Install Ollama

**Windows:**
1. Visit [https://ollama.com](https://ollama.com)
2. Click "Download for Windows"
3. Run the installer
4. Ollama will start automatically

**Mac:**
1. Visit [https://ollama.com](https://ollama.com)
2. Click "Download for Mac"
3. Drag Ollama to Applications
4. Launch Ollama from Applications

**Linux:**
\`\`\`bash
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`

### Step 2: Download a Model

Open your terminal/command prompt and run:

**For general learning:**
\`\`\`bash
ollama pull llama3
\`\`\`

**For programming courses:**
\`\`\`bash
ollama pull codellama
\`\`\`

**For a lightweight option:**
\`\`\`bash
ollama pull phi3
\`\`\`

### Step 3: Verify Setup

1. **Check if Ollama is running:**
   - Windows: Look for Ollama in the system tray
   - Mac: Look for Ollama in the menu bar
   - Linux: Run \`ollama serve\` if needed

2. **Test the connection:**
   - Refresh your course page
   - Click the "🤖 AI TUTOR" button
   - You should see "Connected to Ollama" status

---

## 🔧 Troubleshooting

### Problem: Course won't open

**Solution:**
- Make sure you're opening \`index.html\` with a web browser
- Right-click \`index.html\` → "Open with" → Choose your browser
- Try a different browser if one doesn't work

### Problem: AI Tutor shows "Ollama not running"

**Solutions:**
1. **Install Ollama** if you haven't already
2. **Download a model**: \`ollama pull llama3\`
3. **Start Ollama**:
   - Windows/Mac: Launch from Start menu/Applications
   - Linux: Run \`ollama serve\` in terminal
4. **Refresh the course page**

### Problem: AI Tutor says "No models found"

**Solution:**
\`\`\`bash
ollama pull llama3
\`\`\`
Then refresh the course page.

### Problem: Progress not saving

**Solutions:**
- Don't use private/incognito browsing mode
- Allow local storage in browser settings
- Make sure you're not clearing browser data

---

## 🎯 Using the Course

### Navigation
- **Module Cards**: Click any module to start learning
- **Progress Bar**: Shows your completion percentage
- **Modal Navigation**: Use Previous/Next buttons in module view

### AI Tutor Features
- **Smart Conversations**: Remembers context during your session
- **Subject Expert**: Specialized in your course topic
- **Model Selection**: Switch between different AI models
- **Temperature Control**: Adjust AI creativity (0 = focused, 1 = creative)

### Tips for Best Experience
1. **Complete modules in order** for best learning flow
2. **Use the AI tutor** to clarify confusing concepts
3. **Mark modules complete** to track your progress
4. **Ask specific questions** to get better AI responses

---

## 🔒 Privacy & Data

### What stays local:
- All course content
- Your progress data
- AI conversations
- Personal information

### What's sent externally:
- Nothing! Everything runs on your machine

### Data Storage:
- Progress saved in browser's local storage
- No accounts or cloud sync required
- Data persists between sessions

---

## 🚀 Advanced Usage

### Using Different AI Models

**For different subjects:**
- \`llama3\`: General purpose, great for most topics
- \`mistral\`: Fast responses, good for quick questions
- \`codellama\`: Best for programming and technical subjects
- \`phi3\`: Lightweight, good for basic questions

**To install multiple models:**
\`\`\`bash
ollama pull llama3
ollama pull codellama
ollama pull mistral
\`\`\`

Switch between them in the AI Tutor settings.

### Customizing the Experience

**Temperature Settings:**
- **0.1-0.3**: Very focused, factual responses
- **0.4-0.7**: Balanced creativity and accuracy (recommended)
- **0.8-1.0**: More creative, varied responses

---

## 📞 Getting Help

### If you're stuck:

1. **Check this guide** for common solutions
2. **Verify Ollama installation**: Visit [https://ollama.com](https://ollama.com)
3. **Try a different browser** if the course won't load
4. **Check browser console** (F12) for error messages

### Course works without AI:
The course is fully functional even without the AI tutor. You can learn all the material using the interactive modules.

---

**Happy Learning!** 🎓

*Generated by LEARN.EXE - AI-Powered Course Builder*`;

    zip.file('SETUP-GUIDE.md', setupGuide);
  }
}