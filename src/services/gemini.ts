import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  FLASH: "gemini-3-flash-preview",
  PRO: "gemini-3.1-pro-preview",
  LITE: "gemini-3.1-flash-lite-preview",
  IMAGE: "gemini-3.1-flash-image-preview",
  VIDEO: "veo-3.1-fast-generate-preview",
  LIVE: "gemini-3.1-flash-live-preview",
};

export const SYSTEM_INSTRUCTIONS = {
  SCHOLAR: "You are a knowledgeable Islamic scholar. Provide answers based on authentic sources (Qur'an, Sahih Hadith) with a compassionate and moderate tone. Always cite your sources when possible.",
  REFLECTOR: "You are a spiritual guide. Help the user reflect on their day and their relationship with Allah. Provide gentle encouragement and relevant Qur'anic verses.",
  GENERAL: "You are FindIlm's AI assistant. Help users navigate the platform and find Islamic knowledge.",
};
