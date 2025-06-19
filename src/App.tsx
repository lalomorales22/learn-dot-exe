import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Zap, Brain, Clock, Target, Code, Atom, Calculator, Dna, Globe, Microscope, Send, Bot, User, Edit3, Download, Eye, Database, Folder, Settings } from 'lucide-react';
import { claudeService } from './services/claudeService';
import { CourseGenerator } from './services/courseGenerator';
import { CourseInput, CourseStructure, ChatMessage } from './types/course';

function App() {
  const [step, setStep] = useState<'chat' | 'review' | 'generated' | 'course-actions'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI course designer powered by Groq and Qwen3-32B. I\'m here to help you create a personalized learning experience. What would you like to learn? You can tell me about any subject - from physics and chemistry to programming, history, or anything else that interests you!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseInput, setCourseInput] = useState<CourseInput>({
    subject: '',
    objectives: '',
    skillLevel: 'beginner',
    duration: '',
    focusAreas: []
  });
  const [generatedCourse, setGeneratedCourse] = useState<CourseStructure | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseFiles, setCourseFiles] = useState<Blob | null>(null);
  const [isCreatingFiles, setIsCreatingFiles] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const subjectIcons = {
    'Physics': Zap,
    'Chemistry': Atom,
    'Mathematics': Calculator,
    'Programming': Code,
    'Biology': Dna,
    'History': Globe,
    'General': BookOpen,
    'Science': Microscope
  };

  const getSubjectIcon = (subject: string) => {
    const Icon = Object.entries(subjectIcons).find(([key]) => 
      subject.toLowerCase().includes(key.toLowerCase())
    )?.[1] || BookOpen;
    return Icon;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Get AI response
      const response = await claudeService.sendMessage(userMessage);
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Check if AI provided a course analysis
      const courseAnalysis = claudeService.extractCourseAnalysis(response);
      if (courseAnalysis) {
        setCourseInput({
          subject: courseAnalysis.subject,
          objectives: courseAnalysis.objectives,
          skillLevel: courseAnalysis.skillLevel,
          duration: courseAnalysis.duration,
          focusAreas: courseAnalysis.focusAreas
        });
        setStep('review');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateCourse = async () => {
    setIsGenerating(true);
    
    try {
      const courseStructure = await claudeService.generateCourseStructure(courseInput);
      setGeneratedCourse(courseStructure);
      setStep('generated');
    } catch (error) {
      console.error('Error generating course:', error);
      alert('Sorry, there was an error generating your course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCourseFiles = async () => {
    if (!generatedCourse) return;
    
    setIsCreatingFiles(true);
    
    try {
      const generator = new CourseGenerator(generatedCourse, courseInput);
      const files = await generator.generateCourseFiles();
      setCourseFiles(files);
      setStep('course-actions');
    } catch (error) {
      console.error('Error generating course files:', error);
      alert('Sorry, there was an error creating the course files. Please try again.');
    } finally {
      setIsCreatingFiles(false);
    }
  };

  const downloadCourse = () => {
    if (!courseFiles) return;
    
    const url = URL.createObjectURL(courseFiles);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedCourse?.title.replace(/[^a-zA-Z0-9]/g, '-')}-course.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewCourse = () => {
    if (!courseFiles) return;
    
    // Create a temporary URL for the course files
    const url = URL.createObjectURL(courseFiles);
    window.open(url, '_blank');
  };

  const addFocusArea = (area: string) => {
    if (area && !courseInput.focusAreas.includes(area)) {
      setCourseInput(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, area]
      }));
    }
  };

  const removeFocusArea = (area: string) => {
    setCourseInput(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(a => a !== area)
    }));
  };

  const startOver = () => {
    setStep('chat');
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI course designer powered by Groq and Qwen3-32B. I\'m here to help you create a personalized learning experience. What would you like to learn? You can tell me about any subject - from physics and chemistry to programming, history, or anything else that interests you!',
        timestamp: new Date()
      }
    ]);
    setCourseInput({
      subject: '',
      objectives: '',
      skillLevel: 'beginner',
      duration: '',
      focusAreas: []
    });
    setGeneratedCourse(null);
    setCourseFiles(null);
    claudeService.resetConversation();
  };

  // Debug Panel Component
  const DebugPanel = () => (
    <div className="fixed top-4 left-4 bg-gray-900 border-2 border-yellow-400 p-4 text-xs font-mono z-50 max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-yellow-400 font-bold">🔧 DEBUG INFO</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-white hover:text-red-400"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1 text-gray-300">
        <div><span className="text-blue-400">Environment:</span> {import.meta.env.MODE}</div>
        <div><span className="text-blue-400">Has API Key:</span> {!!import.meta.env.VITE_GROQ_API_KEY ? 'Yes' : 'No'}</div>
        <div><span className="text-blue-400">Key Length:</span> {import.meta.env.VITE_GROQ_API_KEY?.length || 0}</div>
        <div><span className="text-blue-400">Key Start:</span> {import.meta.env.VITE_GROQ_API_KEY ? import.meta.env.VITE_GROQ_API_KEY.substring(0, 8) + '...' : 'none'}</div>
        <div><span className="text-blue-400">All Env Keys:</span></div>
        <div className="text-xs text-gray-400 max-h-20 overflow-y-auto">
          {Object.keys(import.meta.env).map(key => (
            <div key={key}>• {key}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // Chat Interface
  if (step === 'chat') {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <div className="scanlines"></div>
        
        {showDebug && <DebugPanel />}
        
        {/* Header */}
        <div className="border-b-2 border-blue-500 bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Brain className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl font-bold font-mono text-blue-400">
                LEARN.EXE
              </h1>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="ml-4 p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                title="Toggle Debug Info"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <p className="text-lg text-gray-300 font-mono mb-1">
              AI-POWERED COURSE BUILDER
            </p>
            <p className="text-sm text-gray-400 font-mono">
              POWERED BY GROQ • QWEN3-32B • DESIGN YOUR LEARNING EXPERIENCE
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 border-2 border-blue-500 bg-gray-900 p-4 overflow-y-auto mb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-green-600 border-green-400' 
                        : 'bg-blue-600 border-blue-400'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`p-3 border-2 font-mono text-sm ${
                      message.role === 'user'
                        ? 'bg-green-900 border-green-500 text-green-100'
                        : 'bg-blue-900 border-blue-500 text-blue-100'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded border-2 bg-blue-600 border-blue-400 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-3 border-2 bg-blue-900 border-blue-500 text-blue-100 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <span className="ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-2 border-blue-500 bg-gray-900 p-4">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what you'd like to learn..."
                className="flex-1 p-3 bg-black border-2 border-gray-600 text-white font-mono focus:border-blue-400 focus:outline-none transition-colors resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`px-6 py-3 border-2 font-mono font-bold transition-colors ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-400 font-mono mt-2">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>

        {/* Built by Bolt Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-600 text-gray-300 text-xs font-mono hover:border-blue-400 hover:text-blue-400 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Built by Bolt
          </a>
        </div>
      </div>
    );
  }

  // Review Interface
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <div className="scanlines"></div>
        
        {/* Header */}
        <div className="border-b-2 border-blue-500 bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Edit3 className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl font-bold font-mono text-blue-400">
                LEARN.EXE
              </h1>
            </div>
            <p className="text-lg text-gray-300 font-mono mb-1">
              REVIEW YOUR LEARNING EXPERIENCE
            </p>
            <p className="text-sm text-gray-400 font-mono">
              AI ANALYZED YOUR NEEDS • CONFIRM OR EDIT DETAILS
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="border-2 border-blue-500 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold font-mono text-green-400 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6" />
              AI COURSE ANALYSIS
            </h2>

            <div className="space-y-6">
              {/* Subject Input */}
              <div>
                <label className="block text-sm font-bold text-blue-400 font-mono mb-2">
                  ▸ COURSE SUBJECT
                </label>
                <input
                  type="text"
                  value={courseInput.subject}
                  onChange={(e) => setCourseInput(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-3 bg-black border-2 border-gray-600 text-white font-mono focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-bold text-blue-400 font-mono mb-2">
                  ▸ LEARNING OBJECTIVES
                </label>
                <textarea
                  value={courseInput.objectives}
                  onChange={(e) => setCourseInput(prev => ({ ...prev, objectives: e.target.value }))}
                  rows={3}
                  className="w-full p-3 bg-black border-2 border-gray-600 text-white font-mono focus:border-blue-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-bold text-blue-400 font-mono mb-2">
                  ▸ SKILL LEVEL
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setCourseInput(prev => ({ ...prev, skillLevel: level }))}
                      className={`p-3 border-2 font-mono font-bold transition-colors ${
                        courseInput.skillLevel === level
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-blue-400 hover:text-white'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-blue-400 font-mono mb-2">
                  ▸ COURSE DURATION
                </label>
                <input
                  type="text"
                  value={courseInput.duration}
                  onChange={(e) => setCourseInput(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-3 bg-black border-2 border-gray-600 text-white font-mono focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Focus Areas */}
              <div>
                <label className="block text-sm font-bold text-blue-400 font-mono mb-2">
                  ▸ FOCUS AREAS
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add specific topics..."
                    className="flex-1 p-2 bg-black border-2 border-gray-600 text-white font-mono focus:border-blue-400 focus:outline-none transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addFocusArea((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add specific topics..."]') as HTMLInputElement;
                      addFocusArea(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 border-2 border-green-400 text-white font-mono font-bold transition-colors"
                  >
                    ADD
                  </button>
                </div>
                {courseInput.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {courseInput.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-900 text-purple-200 font-mono text-sm border border-purple-600 cursor-pointer hover:bg-purple-800 transition-colors"
                        onClick={() => removeFocusArea(area)}
                      >
                        {area} ✕
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={generateCourse}
                  disabled={!courseInput.subject || !courseInput.objectives || isGenerating}
                  className={`flex-1 py-4 px-6 font-mono font-bold text-lg border-2 transition-all ${
                    !courseInput.subject || !courseInput.objectives || isGenerating
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500 border-green-400 text-white hover:shadow-lg hover:shadow-green-400/20'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      GENERATING COURSE...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      LOOKS GOOD! GENERATE COURSE
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setStep('chat')}
                  className="px-6 py-4 bg-gray-700 hover:bg-gray-600 border-2 border-gray-500 text-white font-mono font-bold transition-colors"
                >
                  ◀ BACK TO CHAT
                </button>
              </div>

              {/* Info Box */}
              <div className="border border-gray-600 bg-gray-800 p-4 text-sm font-mono text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">🤖</span>
                  <div>
                    <strong className="text-blue-400">AI ANALYSIS:</strong>
                    <br />
                    I've analyzed your learning needs using Qwen3-32B and pre-filled this form. Feel free to edit any details 
                    before I generate your comprehensive learning app with interactive content and AI tutoring.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs font-mono text-gray-500">
            LEARN.EXE • AI-POWERED LEARNING • BUILT WITH GROQ & QWEN3-32B
          </div>
        </div>

        {/* Built by Bolt Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-600 text-gray-300 text-xs font-mono hover:border-blue-400 hover:text-blue-400 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Built by Bolt
          </a>
        </div>
      </div>
    );
  }

  // Generated Course Interface
  if (step === 'generated' && generatedCourse) {
    const Icon = getSubjectIcon(courseInput.subject);
    
    return (
      <div className="min-h-screen bg-black text-white relative">
        <div className="scanlines"></div>
        
        {/* Header */}
        <div className="border-b-2 border-blue-500 bg-gray-900 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold font-mono text-blue-400">
                {generatedCourse.title}
              </h1>
            </div>
            <p className="text-sm text-gray-400 font-mono mb-2">
              {generatedCourse.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              <span className="text-green-400">
                ◆ {generatedCourse.totalChunks} CHUNKS
              </span>
              <span className="text-yellow-400">
                ◆ {generatedCourse.estimatedHours} HOURS
              </span>
              <span className="text-purple-400">
                ◆ {generatedCourse.difficulty} LEVEL
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Course Chunks */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold font-mono text-blue-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                COURSE MODULES
              </h2>
              
              <div className="space-y-4">
                {generatedCourse.chunks.map((chunk, index) => (
                  <div key={index} className="border-2 border-blue-500 bg-gray-900 p-4 hover:border-green-400 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold font-mono text-green-400">
                        {chunk.title}
                      </h3>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-900 text-blue-200 font-mono">
                          {chunk.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-yellow-900 text-yellow-200 font-mono">
                          {chunk.estimatedTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {chunk.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-blue-400">▸</span>
                          <span className="font-mono">{topic}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-400 font-mono">
                      {chunk.concepts} key concepts • Interactive examples included
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Visualizations */}
              <div className="border-2 border-purple-500 bg-gray-900 p-4">
                <h3 className="font-bold font-mono text-purple-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  INTERACTIVE VISUALS
                </h3>
                <div className="space-y-2">
                  {generatedCourse.visualizations.map((viz, index) => (
                    <div key={index} className="text-sm text-gray-300 font-mono flex items-center gap-2">
                      <span className="text-purple-400">◆</span>
                      {viz}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tutor */}
              <div className="border-2 border-green-500 bg-gray-900 p-4">
                <h3 className="font-bold font-mono text-green-400 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI TUTOR SYSTEM
                </h3>
                <div className="text-sm text-gray-300 font-mono mb-3">
                  Specialized {courseInput.subject} assistant powered by Qwen3-32B
                </div>
                <div className="text-xs text-gray-400 bg-black p-2 border border-gray-700 font-mono">
                  {generatedCourse.aiPrompt.substring(0, 120)}...
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button 
                  className={`w-full font-bold py-3 px-4 font-mono border-2 transition-all ${
                    isCreatingFiles
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white hover:shadow-lg hover:shadow-blue-400/20'
                  }`}
                  onClick={generateCourseFiles}
                  disabled={isCreatingFiles}
                >
                  {isCreatingFiles ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      CREATING COURSE FILES...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Folder className="w-4 h-4" />
                      ▶ CREATE LEARNING APP
                    </div>
                  )}
                </button>
                
                <button 
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 font-mono border-2 border-gray-500 transition-colors"
                  onClick={() => setStep('review')}
                >
                  ◀ MODIFY COURSE
                </button>

                <button 
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 font-mono border-2 border-red-500 transition-colors"
                  onClick={startOver}
                >
                  🔄 START OVER
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Built by Bolt Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-600 text-gray-300 text-xs font-mono hover:border-blue-400 hover:text-blue-400 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Built by Bolt
          </a>
        </div>
      </div>
    );
  }

  // Course Actions Interface
  if (step === 'course-actions' && generatedCourse && courseFiles) {
    const Icon = getSubjectIcon(courseInput.subject);
    
    return (
      <div className="min-h-screen bg-black text-white relative">
        <div className="scanlines"></div>
        
        {/* Header */}
        <div className="border-b-2 border-blue-500 bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Icon className="w-10 h-10 text-green-400" />
              <h1 className="text-4xl font-bold font-mono text-green-400">
                COURSE READY!
              </h1>
            </div>
            <p className="text-lg text-gray-300 font-mono mb-1">
              {generatedCourse.title} • LEARNING APP GENERATED
            </p>
            <p className="text-sm text-gray-400 font-mono">
              YOUR INTERACTIVE COURSE WITH AI TUTOR IS READY
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="border-2 border-green-500 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold font-mono text-green-400 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              COURSE SUCCESSFULLY CREATED
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Course Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-400 font-mono">📚 COURSE DETAILS</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-gray-400">Subject:</span> <span className="text-white">{courseInput.subject}</span></div>
                  <div><span className="text-gray-400">Level:</span> <span className="text-white">{courseInput.skillLevel}</span></div>
                  <div><span className="text-gray-400">Duration:</span> <span className="text-white">{courseInput.duration}</span></div>
                  <div><span className="text-gray-400">Modules:</span> <span className="text-white">{generatedCourse.totalChunks}</span></div>
                  <div><span className="text-gray-400">Est. Hours:</span> <span className="text-white">{generatedCourse.estimatedHours}</span></div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-400 font-mono">🚀 FEATURES INCLUDED</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Interactive Learning Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>AI Tutor with Qwen3-32B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Progress Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Interactive Quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Code Examples & Demos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Retro 8-bit Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={downloadCourse}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 font-mono border-2 border-green-400 transition-all hover:shadow-lg hover:shadow-green-400/20"
              >
                <Download className="w-5 h-5" />
                DOWNLOAD COURSE
              </button>

              <button
                onClick={previewCourse}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 font-mono border-2 border-blue-400 transition-all hover:shadow-lg hover:shadow-blue-400/20"
              >
                <Eye className="w-5 h-5" />
                PREVIEW COURSE
              </button>

              <button
                onClick={() => alert('Database integration coming soon! For now, you can download your course.')}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 font-mono border-2 border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-400/20"
              >
                <Database className="w-5 h-5" />
                SAVE TO DB
              </button>
            </div>

            {/* Instructions */}
            <div className="border border-gray-600 bg-gray-800 p-4 text-sm font-mono text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">💡</span>
                <div>
                  <strong className="text-green-400">HOW TO USE YOUR COURSE:</strong>
                  <br />
                  1. <strong>Download:</strong> Get the complete course as a ZIP file
                  <br />
                  2. <strong>Extract:</strong> Unzip the files to your computer
                  <br />
                  3. <strong>Open:</strong> Open index.html in your web browser
                  <br />
                  4. <strong>Learn:</strong> Navigate modules and chat with your AI tutor!
                  <br />
                  <br />
                  <strong className="text-yellow-400">Note:</strong> For AI tutor features, you'll need to add your Groq API key to the course files.
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-6">
              <button 
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 font-mono border-2 border-gray-500 transition-colors"
                onClick={() => setStep('generated')}
              >
                ◀ BACK TO COURSE
              </button>

              <button 
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 font-mono border-2 border-red-500 transition-colors"
                onClick={startOver}
              >
                🔄 CREATE NEW COURSE
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs font-mono text-gray-500">
            LEARN.EXE • AI-POWERED LEARNING • BUILT WITH GROQ & QWEN3-32B
          </div>
        </div>

        {/* Built by Bolt Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-600 text-gray-300 text-xs font-mono hover:border-blue-400 hover:text-blue-400 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Built by Bolt
          </a>
        </div>
      </div>
    );
  }

  return null;
}

export default App;