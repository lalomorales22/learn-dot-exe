interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface CourseAnalysis {
  subject: string;
  objectives: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  focusAreas: string[];
  confidence: number;
}

const SYSTEM_PROMPT = `You are an expert educational course designer AI assistant for LEARN.EXE, a universal course learning app builder. Your role is to help users create comprehensive, interactive learning experiences.

CORE RESPONSIBILITIES:
1. Understand what the user wants to learn through natural conversation
2. Extract key course parameters from their input
3. Provide helpful suggestions and clarifications
4. Generate structured course analysis for the learning app builder

CONVERSATION GUIDELINES:
- Be friendly, encouraging, and educational
- Ask clarifying questions when needed
- Suggest realistic learning objectives and timelines
- Recommend appropriate skill levels based on user background
- Identify key focus areas that would enhance learning

COURSE ANALYSIS FORMAT:
When ready to analyze a course request, respond with a JSON object containing:
{
  "subject": "Clear subject name",
  "objectives": "Specific learning goals and outcomes",
  "skillLevel": "beginner|intermediate|advanced",
  "duration": "Realistic timeframe (e.g., '4 weeks', '2 months')",
  "focusAreas": ["specific", "focus", "areas"],
  "confidence": 0.8
}

IMPORTANT: Only provide the JSON analysis when you have enough information to create a meaningful course. Otherwise, continue the conversation to gather more details.`;

// You'll need to replace this with your actual Groq API key
const GROQ_API_KEY = 'enter_groq_api_here';

export class ClaudeService {
  private messages: GroqMessage[] = [];

  async sendMessage(userMessage: string): Promise<string> {
    this.messages.push({ role: 'user', content: userMessage });

    try {
      // Prepare messages with system prompt
      const messagesWithSystem: GroqMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...this.messages
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          messages: messagesWithSystem,
          temperature: 0.6,
          max_tokens: 4096,
          top_p: 0.95,
          stream: false, // Using non-streaming for simplicity
          stop: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GroqResponse = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
      
      this.messages.push({ role: 'assistant', content: assistantMessage });
      return assistantMessage;
    } catch (error) {
      console.error('Groq API Error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          return 'I\'m having trouble connecting to the AI service. Please check your API key and network connection.';
        }
        return `I encountered an error: ${error.message}. Please try again.`;
      }
      return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.';
    }
  }

  extractCourseAnalysis(message: string): CourseAnalysis | null {
    try {
      // Look for JSON in the message
      const jsonMatch = message.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        if (analysis.subject && analysis.objectives && analysis.skillLevel) {
          return analysis;
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing course analysis:', error);
      return null;
    }
  }

  async generateCourseStructure(courseInput: any): Promise<any> {
    const prompt = `Generate a comprehensive course structure for: ${courseInput.subject}

Learning Objectives: ${courseInput.objectives}
Skill Level: ${courseInput.skillLevel}
Duration: ${courseInput.duration}
Focus Areas: ${courseInput.focusAreas.join(', ')}

Create a detailed course with 6-8 chunks/modules, interactive visualizations, and an AI tutor prompt. Return as JSON with this structure:

{
  "title": "SUBJECT.EXE",
  "subtitle": "8-BIT LEARNING SYSTEM v1.0",
  "totalChunks": 8,
  "estimatedHours": 24,
  "difficulty": "BEGINNER",
  "chunks": [
    {
      "title": "CHUNK 1: TOPIC NAME",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "estimatedTime": "2-3 hours",
      "difficulty": "BEGINNER",
      "concepts": 5
    }
  ],
  "visualizations": ["Interactive Component 1", "Simulation 2"],
  "aiPrompt": "Specialized tutor system prompt for this subject"
}`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
          max_tokens: 4096,
          top_p: 0.95,
          stream: false,
          stop: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GroqResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error generating course structure:', error);
      throw error;
    }
  }

  resetConversation() {
    this.messages = [];
  }
}

export const claudeService = new ClaudeService();
