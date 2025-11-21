export enum RoleId {
  USER = 'user',
  SPARK = 'spark', // Extraversion
  ECHO = 'echo',   // Introversion
  VISION = 'vision', // Intuition
  ROOT = 'root',   // Sensing
  LOGIC = 'logic', // Thinking
  HEART = 'heart', // Feeling
  JUDGE = 'judge', // Judging
  FLOW = 'flow'    // Perceiving
}

export interface Character {
  id: RoleId;
  name: string;
  dimension: string; // e.g., "E - Extraversion"
  description: string;
  color: string;
  avatar: string; // Emoji or placeholder char
}

export interface Message {
  id: string;
  roleId: RoleId;
  text: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  content: string;
  summary: string;
  mood: string;
  responses: Message[]; // Characters reacting to the journal
}

export interface MBTIStats {
  E: number;
  I: number;
  N: number;
  S: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export enum AppView {
  CHAT = 'chat',
  JOURNAL = 'journal',
  PROFILE = 'profile'
}