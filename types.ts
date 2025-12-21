
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
  // Added properties for game logic and visualization
  skillType: string;
  level: number;
  exp: number;
  dimension: string; // 如 "T", "F", "N", "S"
  dimensionFull: string; // 如 "思考 (Thinking)", "直觉 (iNtuition)"
  description: string;
  quote: string;
  tags: string[];
  color: string;
  avatar: string; 
  imageUrl: string; 
  unlocked: boolean;
  isActive: boolean;
  cost: number; // 觉醒所需意识能量
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
  energy: number; // 用户拥有的总意识能量
}

export enum AppView {
  CHAT = 'chat',
  JOURNAL = 'journal',
  PROFILE = 'profile', // 宿主属性
  BAZAAR = 'bazaar'    // 灵感集市 (商城)
}
