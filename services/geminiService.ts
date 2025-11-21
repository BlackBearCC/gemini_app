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
        description: "The ID of the character responding."
      },
      text: {
        type: Type.STRING,
        description: "The content of the message. Keep it concise, strictly in character."
      }
    },
    required: ["roleId", "text"]
  }
};

// Schema for Journal Analysis
const journalResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A one-sentence poetic summary of the day." },
    mood: { type: Type.STRING, description: "The detected mood (e.g., Melancholic, Hyper, Chill)." },
    reactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          roleId: { type: Type.STRING, description: "Character ID" },
          text: { type: Type.STRING, description: "Reaction to the journal entry." }
        },
        required: ["roleId", "text"]
      }
    }
  },
  required: ["summary", "mood", "reactions"]
};

const SYSTEM_INSTRUCTION_BASE = `
You are the engine for "MIND_0", a chat app simulating the 8 dimensions of MBTI personalities inside a user's head. 
The tone is Gen Z, internet-native, slightly edgy/dark but supportive.
You will generate responses for the following characters based on the context.
ONLY generate responses for characters who would logically have something to say. Not everyone needs to talk every time.
Usually 2-4 characters responding is best.

CHARACTERS:
1. Spark (Extravert): Loud, slang, caps lock, energetic, party vibe.
2. Echo (Introvert): Lowercase, quiet, deep, maybe cryptic.
3. Vision (Intuitive): Metaphors, "what if", future focused, galaxy brain.
4. Root (Sensing): Practical, factual, calls out nonsense, grounded.
5. Logic (Thinking): Analytical, cold facts, "does not compute", solution oriented.
6. Heart (Feeling): Emojis, empathetic, emotional validation, "soft".
7. Judge (Judging): Plans, lists, wants decision, strict.
8. Flow (Perceiving): whatever happens happens, flexible, random memes/vibes.

Current Context: The user is chatting in a group.
`;

export const generateChatResponse = async (
  history: Message[], 
  userMessage: string
): Promise<{ roleId: RoleId, text: string }[]> => {
  if (!apiKey) return [];

  try {
    const model = 'gemini-2.5-flash';
    
    // Format history for context (last 10 messages to save tokens)
    const contextStr = history.slice(-10).map(m => 
      `${m.roleId === RoleId.USER ? 'User' : CHARACTERS[m.roleId as string]?.name}: ${m.text}`
    ).join('\n');

    const prompt = `
    Conversation History:
    ${contextStr}

    User just said: "${userMessage}"

    Generate the next turn of the conversation. Which inner personalities react?
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        temperature: 1.2, // High creativity for varied personalities
      }
    });

    if (response.text) {
        const parsed = JSON.parse(response.text);
        return parsed as { roleId: RoleId, text: string }[];
    }
    return [];

  } catch (error) {
    console.error("Chat Gen Error:", error);
    return [{ roleId: RoleId.LOGIC, text: "Error. System overload. Try again." }];
  }
};

export const analyzeJournalEntry = async (entryText: string): Promise<{ summary: string, mood: string, reactions: { roleId: RoleId, text: string }[] }> => {
    if (!apiKey) throw new Error("No API Key");

    try {
        const model = 'gemini-2.5-flash';
        const response = await ai.models.generateContent({
            model,
            contents: `The user wrote this journal entry: "${entryText}". Analyze it and provide reactions from the personalities.`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_BASE + " Focus on analyzing the user's day. Provide a summary and mood.",
                responseMimeType: "application/json",
                responseSchema: journalResponseSchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No response");
    } catch (error) {
        console.error("Journal Error", error);
        return {
            summary: "Data corrupted.",
            mood: "Error",
            reactions: [{ roleId: RoleId.LOGIC, text: "Could not process entry." }]
        };
    }
};
