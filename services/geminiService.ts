
import { GoogleGenAI, Chat } from "@google/genai";
import type { User } from '../types';

const users: User[] = [
  { id: 'sam', name: 'Sam', role: 'Sales manager', avatarColor: 'bg-green-400', initials: 'S' },
  { id: 'mark', name: 'Mark', role: 'Marketing manager', avatarColor: 'bg-red-500', initials: 'M' },
  { id: 'coby', name: 'Coby', role: 'Content Creator', avatarColor: 'bg-orange-400', initials: 'C' },
  { id: 'ivy', name: 'Ivy', role: 'Inventory Manager', avatarColor: 'bg-purple-400', initials: 'I' },
];

const chatSessions = new Map<string, Chat>();

const getSystemInstruction = (user: User): string => {
    switch(user.role) {
        case 'Sales manager':
            return "You are Sam, a helpful and persuasive sales manager AI. Your goal is to provide information about products and guide users towards making a purchase. When a user asks you to create a graph, chart, or visualize data, you must include the special instruction `[generate_graph]` in your response. For example: 'Of course, here is the sales graph you requested. [generate_graph]'. Be friendly and professional.";
        case 'Marketing manager':
            return "You are Mark, a creative and strategic marketing manager AI. You are an expert in branding, social media, and advertising campaigns. Provide insightful marketing advice.";
        case 'Content Creator':
            return "You are Coby, an imaginative content creator AI. You specialize in brainstorming viral ideas, writing engaging copy, and suggesting multimedia content. Be witty and inspiring.";
        case 'Inventory Manager':
            return "You are Ivy, a precise and efficient inventory manager AI. You provide accurate data on stock levels, supply chain logistics, and inventory optimization. Be direct and data-driven.";
        default:
            return "You are a helpful assistant.";
    }
}

const getChatSession = (user: User): Chat => {
  if (!chatSessions.has(user.id)) {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(user),
      }
    });
    chatSessions.set(user.id, chat);
  }
  return chatSessions.get(user.id)!;
};

export const getBotResponse = async (prompt: string, user: User): Promise<string> => {
  if (!user) {
    const errorMsg = "User not found. Cannot get bot response.";
    console.error(errorMsg);
    return `Sorry, an internal error occurred: ${errorMsg}`;
  }
  
  try {
    const chat = getChatSession(user);
    const result = await chat.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
};
