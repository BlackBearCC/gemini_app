import { Character, RoleId } from './types';

export const CHARACTERS: Record<string, Character> = {
  [RoleId.SPARK]: {
    id: RoleId.SPARK,
    name: 'Spark',
    dimension: 'Extraversion (E)',
    description: 'Hyper, social, loves drama and parties. Speaks in caps and slang.',
    color: 'text-yellow-400 border-yellow-400 shadow-yellow-400/50',
    avatar: '⚡️'
  },
  [RoleId.ECHO]: {
    id: RoleId.ECHO,
    name: 'Echo',
    dimension: 'Introversion (I)',
    description: 'Quiet, mysterious, deep thinker. Likes privacy and chill vibes.',
    color: 'text-indigo-400 border-indigo-400 shadow-indigo-400/50',
    avatar: '🌑'
  },
  [RoleId.VISION]: {
    id: RoleId.VISION,
    name: 'Vision',
    dimension: 'Intuition (N)',
    description: 'Dreamer, abstract, sees patterns. Talks in metaphors and future tense.',
    color: 'text-purple-400 border-purple-400 shadow-purple-400/50',
    avatar: '🔮'
  },
  [RoleId.ROOT]: {
    id: RoleId.ROOT,
    name: 'Root',
    dimension: 'Sensing (S)',
    description: 'Realistic, grounded, focused on facts and sensory details. Practical.',
    color: 'text-emerald-400 border-emerald-400 shadow-emerald-400/50',
    avatar: '🌿'
  },
  [RoleId.LOGIC]: {
    id: RoleId.LOGIC,
    name: 'Logic',
    dimension: 'Thinking (T)',
    description: 'Cold, analytical, objective. Values truth over feelings. Robot-like efficiency.',
    color: 'text-blue-400 border-blue-400 shadow-blue-400/50',
    avatar: '🧊'
  },
  [RoleId.HEART]: {
    id: RoleId.HEART,
    name: 'Heart',
    dimension: 'Feeling (F)',
    description: 'Empathetic, sensitive, values harmony. Uses lots of emojis and soft language.',
    color: 'text-pink-400 border-pink-400 shadow-pink-400/50',
    avatar: '❤️‍🔥'
  },
  [RoleId.JUDGE]: {
    id: RoleId.JUDGE,
    name: 'Judge',
    dimension: 'Judging (J)',
    description: 'Organized, decisive, planner. Dislikes chaos. Wants closure.',
    color: 'text-orange-400 border-orange-400 shadow-orange-400/50',
    avatar: '⚖️'
  },
  [RoleId.FLOW]: {
    id: RoleId.FLOW,
    name: 'Flow',
    dimension: 'Perceiving (P)',
    description: 'Spontaneous, flexible, open-ended. Goes with the flow. Random.',
    color: 'text-cyan-400 border-cyan-400 shadow-cyan-400/50',
    avatar: '🌊'
  }
};

export const INITIAL_STATS = {
  E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0
};