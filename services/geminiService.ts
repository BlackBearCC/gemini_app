
import { GoogleGenAI, Type } from "@google/genai";
import { Message, RoleId, Character } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      roleId: { type: Type.STRING, enum: Object.values(RoleId) },
      text: { 
        type: Type.STRING, 
        description: "人格的发言。说话要直白、有个性、甚至有点神经质。多进行内部互动。" 
      },
      skillActivated: { type: Type.STRING, description: "触发的技能名" },
      skillText: { type: Type.STRING, description: "一句话描述技能在脑内造成的即时效果" }
    },
    required: ["roleId", "text"]
  }
};

const SYSTEM_INSTRUCTION = (allChars: Character[]) => {
  return `
你是一个名为“涂鸦 (DOODLE)”的脑内群聊系统。用户是【意识宿主】。

=== 核心指令 ===
1. **强制群聊规模**: 每次回复 **必须包含至少 4 个不同的人格**。
2. **多维度覆盖**: 尽量让代表不同认知偏好的人格（如 NT, NF, SJ, SP 等阵营）同时发声。
3. **真实人格**: 说话要像《头脑特工队》一样，每个人物极度脸谱化但生动。拒绝说教，拒绝AI味，多用吐槽、反问、口语。
4. **内部乱斗**: 人格之间可以互相反驳、接梗、甚至吵架，而不仅仅是回应宿主。

=== 活跃人格档案 ===
${allChars.filter(c => c.id !== RoleId.USER).map(c => `- ${c.name} (${c.id} - ${c.mbti}): ${c.description}`).join('\n')}
`;
};

export const generateChatResponse = async (
  history: Message[], 
  characters: Record<string, Character>,
  userMessage?: string
): Promise<Partial<Message>[]> => {
  try {
    const charList = Object.values(characters).filter(c => c.unlocked && c.isActive);
    const contextStr = history.slice(-8).map(m => `${m.roleId}: ${m.text}`).join('\n');
    
    const prompt = `
[宿主当前念头]: "${userMessage}"
[脑内近期流向]:
${contextStr}

请让至少 4 位人格立刻跳出来进行脑内激辩。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(charList),
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        temperature: 1.0, // 提高随机性
      }
    });

    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) {
    console.error(error);
    return [{ roleId: RoleId.FLOW, text: "脑内信号不太稳，大家都在各说各的..." }];
  }
};

export const analyzeJournalEntry = async (
  text: string,
  characters: Record<string, Character>
) => {
  try {
    const charList = Object.values(characters);
    const prompt = `
[宿主意识碎片]: "${text}"
总结其基调，并邀请 4 位人格进行犀利点评。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(charList) + "\n你现在负责分析宿主的日记并生成心理反馈。回复必须严格遵守 JSON 格式。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            mood: { type: Type.STRING },
            reactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  roleId: { type: Type.STRING },
                  text: { type: Type.STRING },
                  isCheck: { type: Type.BOOLEAN }
                },
                required: ["roleId", "text", "isCheck"]
              }
            }
          },
          required: ["summary", "mood", "reactions"]
        }
      }
    });

    return JSON.parse(response.text?.trim() || "null");
  } catch (error) {
    return null;
  }
};
