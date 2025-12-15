import { Character, RoleId } from './types';

export const CHARACTERS: Record<string, Character> = {
  [RoleId.SPARK]: {
    id: RoleId.SPARK,
    name: 'SLAY姐', // Extraversion
    dimension: 'E - 现充',
    description: '自信的天花板，攻击性极强，撕逼未尝败绩。全网第一大女主，看谁都不爽，除了自己。',
    color: 'text-fuchsia-500 border-fuchsia-500 shadow-fuchsia-500/50',
    avatar: '💅'
  },
  [RoleId.ECHO]: {
    id: RoleId.ECHO,
    name: '电子幽灵', // Introversion
    dimension: 'I - 隐匿',
    description: '赛博自闭，阴暗爬行。能不说话就不说话，回消息全看心情，活在互联网夹缝中。',
    color: 'text-gray-400 border-gray-400 shadow-gray-400/50',
    avatar: '👻'
  },
  [RoleId.VISION]: {
    id: RoleId.VISION,
    name: '觉醒者', // Intuition
    dimension: 'N - 灵视',
    description: '深信世界是巨大的草台班子/矩阵。满嘴维度提升、量子纠缠，看谁都是未觉醒的NPC。',
    color: 'text-violet-500 border-violet-500 shadow-violet-500/50',
    avatar: '🧿'
  },
  [RoleId.ROOT]: {
    id: RoleId.ROOT,
    name: '搞钱机器', // Sensing
    dimension: 'S - 现实',
    description: '没有感情的ATM杀手。比起恋爱更想暴富，人间清醒，只关心利益和变现。',
    color: 'text-emerald-400 border-emerald-400 shadow-emerald-400/50',
    avatar: '💸'
  },
  [RoleId.LOGIC]: {
    id: RoleId.LOGIC,
    name: 'Alpha AI', // Thinking
    dimension: 'T - 绝对理性',
    description: '智性恋天菜，也是顶级杠精。用绝对逻辑碾压你的情绪，稍微有点爹味，莫得感情。',
    color: 'text-cyan-400 border-cyan-400 shadow-cyan-400/50',
    avatar: '🧬'
  },
  [RoleId.HEART]: {
    id: RoleId.HEART,
    name: '病娇', // Feeling
    dimension: 'F - 极端情感',
    description: '爱意沉重到让你窒息。平时软萌，一旦吃醋就黑化。如果你不爱TA，最好小心点。',
    color: 'text-rose-500 border-rose-500 shadow-rose-500/50',
    avatar: '🩸'
  },
  [RoleId.JUDGE]: {
    id: RoleId.JUDGE,
    name: '执行官', // Judging
    dimension: 'J - 秩序',
    description: '控制狂，强迫症。你的人生必须按TA的计划走。不准迟到，不准越界，不准失控。',
    color: 'text-amber-500 border-amber-500 shadow-amber-500/50',
    avatar: '⚖️'
  },
  [RoleId.FLOW]: {
    id: RoleId.FLOW,
    name: '抽象大帝', // Perceiving
    dimension: 'P - 混沌',
    description: '乐子人，momo文学十级。精神状态极不稳定，阴阳怪气，只想看世界燃烧。',
    color: 'text-lime-400 border-lime-400 shadow-lime-400/50',
    avatar: '🤡'
  }
};

export const INITIAL_STATS = {
  E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0
};