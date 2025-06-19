export interface CourseInput {
  subject: string;
  objectives: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  focusAreas: string[];
}

export interface CourseStructure {
  title: string;
  subtitle: string;
  totalChunks: number;
  estimatedHours: number;
  difficulty: string;
  chunks: CourseChunk[];
  visualizations: string[];
  aiPrompt: string;
}

export interface CourseChunk {
  title: string;
  topics: string[];
  estimatedTime: string;
  difficulty: string;
  concepts: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GeneratedCourse {
  structure: CourseStructure;
  input: CourseInput;
  files: Blob;
  generatedAt: Date;
}