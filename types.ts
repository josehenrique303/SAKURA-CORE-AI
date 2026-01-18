
export type Language = 'pt-BR' | 'en' | 'es' | 'ja';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thought?: string; // Campo para armazenar o processo de raciocínio (Thinking)
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  lastUpdated: number;
  messages: Message[];
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export interface AuthState {
  user: User | null;
  isOpen: boolean;
  mode: 'login' | 'register';
}
