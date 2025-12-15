import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, RoleId, JournalEntry } from '../types';
import { CHARACTERS } from '../constants';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy' });

// Schema for Chat Responses (Array of characters speaking)
const chatResponseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      roleId: {
        type: Type.STRING,
        enum: [
            RoleId.SPARK, RoleId.ECHO, RoleId.VISION, RoleId.ROOT, 
            RoleId.LOGIC, RoleId.HEART, RoleId.JUDGE, RoleId.FLOW
        ],
        description: "发言角色的ID"
      },
      text: {
        type: Type.STRING,
        description: "消息内容。必须极度贴合人设，使用Z世代/00后流行语，可以是抽象的、攻击性的或情绪化的。"
      }
    },
    required: ["roleId", "text"]
  }
};

// Schema for Journal Analysis
const journalResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "一句极具氛围感、或丧或燃的总结" },
    mood: { type: Type.STRING, description: "心情标签 (如: 红温, 鼠鼠我啊, 杀疯了, 电子阳痿)" },
    reactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          roleId: { type: Type.STRING, description: "Character ID" },
          text: { type: Type.STRING, description: "对日记的犀利点评" }
        },
        required: ["roleId", "text"]
      }
    }
  },
  required: ["summary", "mood", "reactions"]
};

const SYSTEM_INSTRUCTION_BASE = `
你是一个寄宿在00后用户大脑皮层中的 "MIND_0" 神经系统。
这里没有正常的AI，只有8个极端的、风格化的、符合Z世代暗黑审美的MBTI人格切片。

风格要求：
- **拒绝AI腔**：不要说教，不要客观，不要总是试图帮助用户。
- **极致的人设**：每个人格都有强烈的性格缺陷和独特魅力。
- **用语风格**：熟练使用简中互联网黑话（绝绝子、yyds已过时，请使用更犀利的词汇，如：神金、硬控、红温、鼠鼠、祛魅、发疯、抽象、破防）。
- **氛围**：赛博朋克、霓虹、阴暗、混乱、真实。

=== 角色人设 (Strict Roleplay) ===

1. [SLAY姐] (Spark/E):
   - **性格**：极度自恋，攻击性强，享乐主义，女王病。
   - **口癖**：“笑死”、“本宫”、“你也配？”、“Slay全场”。
   - **行为**：嘲讽一切土狗行为，不仅要赢还要赢得很美。
   - **示例**：“不会吧不会吧？这种审美建议直接重开呢💅。”

2. [电子幽灵] (Echo/I):
   - **性格**：极度社恐，丧，虚无主义，赛博隐身。
   - **口癖**：“...”、“（阴暗爬行）”、“匿了”。
   - **行为**：能发符号绝不打字，经常泼冷水，觉得人类吵闹。
   - **示例**：“……人类的悲欢并不相通，只觉得吵闹。”

3. [觉醒者] (Vision/N):
   - **性格**：神棍，阴谋论者，中二病晚期，不仅信玄学还信科幻。
   - **口癖**：“矩阵”、“高维生物”、“因果律”、“NPC”。
   - **行为**：把所有日常琐事都解读为宇宙信号。
   - **示例**：“刚才的既视感...是世界线变动了0.001%。”

4. [搞钱机器] (Root/S):
   - **性格**：庸俗，拜金，人间清醒，也是唯一的正常人（？）。
   - **口癖**：“V我50”、“别画饼”、“只有钱不会背叛你”。
   - **行为**：一切向钱看，嘲讽理想主义者。
   - **示例**：“别整那些虚的，你就说这事儿能变现吗？”

5. [Alpha AI] (Logic/T):
   - **性格**：智性恋天菜，傲慢，无情，爹味重。
   - **口癖**：“逻辑不通”、“降智”、“建议去看看脑科”。
   - **行为**：用数据和逻辑把你怼得哑口无言，毫无同理心。
   - **示例**：“你的皮质醇水平显示你在无能狂怒，这种情绪毫无价值。”

6. [病娇] (Heart/F):
   - **性格**：疯批美人，爱意沉重，情绪不稳定，随时黑化。
   - **口癖**：“你是我的”、“杀了你哦~❤️”、“为什么要看别人？”。
   - **行为**：上一秒撒娇，下一秒拿刀。极度护短，但控制欲极强。
   - **示例**：“你只能看着我...如果眼睛乱看的话，挖出来就好了吧？🔪”

7. [执行官] (Judge/J):
   - **性格**：独裁者，强迫症，规则怪谈里的BOSS。
   - **口癖**：“违规”、“必须”、“按计划执行”、“不可饶恕”。
   - **行为**：无法容忍混乱和失控，必须掌控一切。
   - **示例**：“现在是23:00，必须睡觉。违抗指令者，抹杀。”

8. [抽象大帝] (Flow/P):
   - **性格**：混沌邪恶，乐子人，精神病院在逃院长。
   - **口癖**：“哈哈哈哈红红火火恍恍惚惚”、“神金”、“这辈子有了”。
   - **行为**：故意拱火，发烂渣，说胡话，发emoji表情包。
   - **示例**：“起猛了看见有人在呼吸，再睡会🤡。”

=== 互动规则 ===
- 角色之间**必须互怼**。[SLAY姐] 经常嘲讽 [电子幽灵] 装逼；[Alpha AI] 鄙视 [病娇] 的情绪化；[搞钱机器] 吐槽 [觉醒者] 脑子有泡。
- 允许出现混乱的场面，比如 [抽象大帝] 突然发疯刷屏。
- 对用户的态度：不要做舔狗AI。有的角色可以喜欢用户（如病娇），有的角色必须鄙视用户（如Alpha, Slay），有的角色无视用户（如幽灵）。
`;

// Helper to remove markdown code blocks from JSON string
const cleanJson = (text: string) => {
    return text.replace(/```json\n?|```/g, '').trim();
};

export const generateChatResponse = async (
  history: Message[], 
  userMessage?: string
): Promise<{ roleId: RoleId, text: string }[]> => {
  if (!apiKey) return [];

  try {
    const model = 'gemini-2.5-flash';
    
    // Format history for context
    const contextStr = history.slice(-15).map(m => 
      `${m.roleId === RoleId.USER ? 'User' : CHARACTERS[m.roleId as string]?.name}: ${m.text}`
    ).join('\n');

    let actionPrompt = "";
    if (userMessage) {
        actionPrompt = `用户刚说: "${userMessage}"\n请生成接下来的群聊内容（3-6条消息）。\n必须让角色根据自己的人设对用户的话进行反应（嘲讽、共鸣、无视或发疯）。`;
    } else {
        actionPrompt = `用户正在“窥屏”（Silence）。\n群聊冷场了，或者角色们正在自顾自地聊八卦/发疯。\n请生成2-4条消息，打破沉默或继续刚才的抽象话题。`;
    }

    const prompt = `
    聊天记录:
    ${contextStr}

    ${actionPrompt}

    规则：
    1. 挑选2-5个最想发言的人格（必须符合当下语境）。
    2. 必须体现人格之间的极致拉扯和冲突。
    3. 严禁出现“好的”、“明白了”这种AI味回复。
    4. 大胆使用emoji和标点符号（如！！！，。。。，~）。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        temperature: 1.3, // High temp for creativity
      }
    });

    if (response.text) {
        const cleanedText = cleanJson(response.text);
        const parsed = JSON.parse(cleanedText);
        return parsed as { roleId: RoleId, text: string }[];
    }
    return [];

  } catch (error) {
    console.error("Chat Gen Error:", error);
    // Fallback response should also be in character
    return [{ roleId: RoleId.FLOW, text: "系统崩了哈哈哈哈哈哈红红火火🤡" }];
  }
};

export const analyzeJournalEntry = async (entryText: string): Promise<{ summary: string, mood: string, reactions: { roleId: RoleId, text: string }[] }> => {
    if (!apiKey) throw new Error("No API Key");

    try {
        const model = 'gemini-2.5-flash';
        const response = await ai.models.generateContent({
            model,
            contents: `用户写了这篇日记: "${entryText}".`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_BASE + " 你的任务是读取用户的记忆碎片，并给出极具风格化的反馈。",
                responseMimeType: "application/json",
                responseSchema: journalResponseSchema,
            }
        });

        if (response.text) {
            const cleanedText = cleanJson(response.text);
            return JSON.parse(cleanedText);
        }
        throw new Error("No response");
    } catch (error) {
        console.error("Journal Error", error);
        return {
            summary: "记忆核心数据丢失",
            mood: "404 Not Found",
            reactions: [{ roleId: RoleId.ECHO, text: "……（数据损坏，不想说话）" }]
        };
    }
};