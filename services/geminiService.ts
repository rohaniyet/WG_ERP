import { GoogleGenAI } from "@google/genai";
import type { BusinessData } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fetchBusinessInsights = async (query: string, data: BusinessData): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API_KEY is not configured. Please set the environment variable.";
  }
  
  try {
    const dataContext = JSON.stringify(data, null, 2);
    // FIX: Refactored prompt to separate system instructions from the main content, following Gemini API best practices.
    const contents = `
      Analyze the following business data and answer the user's question.

      BUSINESS DATA:
      ---
      ${dataContext}
      ---

      USER QUESTION:
      "${query}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: contents,
      config: {
        systemInstruction: "You are an expert business analyst for a manufacturing company. Provide a concise, insightful, and easy-to-understand answer. If the data is insufficient, state what additional information is needed.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching business insights:", error);
    if (error instanceof Error) {
        return `An error occurred while communicating with the AI model: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the AI model.";
  }
};
