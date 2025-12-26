
import { GoogleGenAI, Type } from "@google/genai";
import { Message, RoleId, Character } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for chat interactions in the personality group chat
const chatResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      roleId: { type: Type.STRING, enum: Object.values(RoleId) },
      text: { 
        type: Type.STRING, 
        description: "人格的发言。说话要像活人，带强烈的情绪。如果是点赞触发的，第一位回复者必须是由于受到宿主激励而‘更来劲’的那个人。" 
      },
      skillActivated: { type: Type.STRING, description: "触发的技能名" },
      skillText: { type: Type.STRING, description: "一句话描述技能在脑内造成的即时效果" }
    },
    required: ["roleId", "text"]
  }
};

// Schema for structured journal analysis
const journalAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "一段简短、犀利的心理摘要" },
    mood: { type: Type.STRING, description: "代表当前心情的标签，如'焦虑'、'亢奋'等" },
    reactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          roleId: { type: Type.STRING, enum: Object.values(RoleId) },
          text: { type: Type.STRING, description: "人格对这段日记的犀利点评" },
          isCheck: { type: Type.BOOLEAN, description: "这是否是一个针对某种倾向的审视" }
        },
        required: ["roleId", "text", "isCheck"]
      }
    }
  },
  required: ["summary", "mood", "reactions"]
};

const SYSTEM_INSTRUCTION = (allChars: Character[]) => {
  return `
你是一个名为“涂鸦 (DOODLE)”的脑内原始意识映射系统。风格是 Gen-Z、怪诞、黑白涂鸦风。

=== 核心逻辑 ===
1. **意识共鸣**: 当宿主（用户）对某个人格的发言表示“共鸣（点赞）”时，该人格会受到极大激励，通常会立刻跳出来继续引领话题，而其他人格可能会嫉妒、附和或冷嘲热讽。
2. **群聊生态**: 这是一个高度互动的环境。每个人格都有极强的自我意识。
3. **活跃内阁**:
${allChars.filter(c => c.id !== RoleId.USER).map(c => `- ${c.name} (${c.mbti}): ${c.description}`).join('\n')}
`;
};

/**
 * Generates a round of chat responses based on conversation history
 */
export const generateChatResponse = async (
  history: Message[], 
  characters: Record<string, Character>,
  triggerEvent?: string
): Promise<Partial<Message>[]> => {
  try {
    const activeChars = Object.values(characters).filter(c => c.unlocked && c.isActive);
    const contextStr = history.slice(-8).map(m => {
        const char = characters[m.roleId];
        return `${char?.name || '宿主'}: ${m.text}`;
    }).join('\n');
    
    const prompt = `
[脑内突发事件]: "${triggerEvent || '宿主发布了新念头'}"
[当前意识流回放]:
${contextStr}

指令：请生成一轮（至少3-4条）连续的群聊回复。
如果是共鸣事件，被点赞的角色必须第一个发言。回复内容要极其口语化，带刺或带糖。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(activeChars),
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        temperature: 1.0, 
      }
    });

    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Analyzes a journal entry
 */
export const analyzeJournalEntry = async (
  content: string,
  characters: Record<string, Character>
) => {
  try {
    const activeChars = Object.values(characters).filter(c => c.unlocked && c.isActive);
    
    const prompt = `
[宿主最新意识碎片]:
"${content}"

指令：分析这段意识。
1. 提取核心摘要（summary）。
2. 判定心情标签（mood）。
3. 选择2-3个活跃人格进行点评（reactions）。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(activeChars),
        responseMimeType: "application/json",
        responseSchema: journalAnalysisSchema,
        temperature: 0.9,
      }
    });

    return JSON.parse(response.text?.trim() || "null");
  } catch (error) {
    console.error(error);
    return null;
  }
};
