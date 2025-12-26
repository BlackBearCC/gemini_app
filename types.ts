
export enum RoleId {
  USER = 'user',
  LOGIC = 'cypher',    // INTJ
  CHRONO = 'chrono',   // INTP
  ROOT = 'midas',      // ENTJ
  FLOW = 'pax' ,       // ENTP
  VISION = 'aether',   // INFJ
  ECHO = 'nocturne',   // INFP
  GOSSIP = 'aura',     // ENFJ
  HEART = 'eros',      // ENFP
  JUDGE = 'justicar',  // ISTJ
  GARDEN = 'haven',    // ISFJ
  STERN = 'sledge',    // ESTJ
  BLOOM = 'nurture',   // ESFJ
  BLADE = 'edge',      // ISTP
  DUST = 'dusk',       // ISFP
  STORM = 'volt',      // ESTP
  SPARK = 'seraphina'  // ESFP
}

export interface Character {
  id: RoleId;
  name: string;
  mbti: string; 
  heroTitle: string; 
  skillName: string; 
  skillEffect: string; 
  skillType: string;
  level: number;
  exp: number;
  dimension: string;
  dimensionFull: string;
  description: string;
  quote: string;
  tags: string[];
  color: string;
  avatar: string; 
  imageUrl: string; 
  generatedAvatar?: string; // 新增：存储 AI 生成的 Base64 涂鸦头像
  unlocked: boolean;
  isActive: boolean;
  cost: number;
}

export interface Message {
  id: string;
  roleId: RoleId;
  text: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
  skillActivated?: string;
  skillText?: string;
  isCheck?: boolean;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  content: string;
  summary: string;
  mood: string;
  responses: Message[];
}

export interface MBTIStats {
  E: number; I: number; N: number; S: number; 
  T: number; F: number; J: number; P: number;
  energy: number;
}

export enum AppView {
  CHAT = 'chat',
  JOURNAL = 'journal',
  PROFILE = 'profile',
  BAZAAR = 'bazaar'
}
