
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export interface GeminiResponse {
  text: string;
  thought?: string;
}

export class GeminiService {
  private async generate(
    prompt: string, 
    history: { role: string; content: string }[] = [],
    languageContext?: string
  ): Promise<GeminiResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contents = [
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ];

      // Injeta uma diretriz de linguagem extra para garantir conformidade
      const finalSystemInstruction = languageContext 
        ? `${SYSTEM_INSTRUCTION}\n\nURGENT INSTRUCTION: You MUST respond entirely in the following language: ${languageContext}. Do not use any other language for explanations or comments.`
        : SYSTEM_INSTRUCTION;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      let textParts = "";
      let thoughtParts = "";

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            textParts += part.text;
          }
          if (part.thought) {
            thoughtParts += part.thought;
          }
        }
      }

      return {
        text: textParts || "Error processing directive.",
        thought: thoughtParts || undefined
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "Technical error in Core SAKURA connection." };
    }
  }

  async sendMessage(prompt: string, history: { role: string; content: string }[], languageLabel: string): Promise<GeminiResponse> {
    return this.generate(prompt, history, languageLabel);
  }

  async improveCode(code: string, customPrompt: string, languageLabel: string): Promise<GeminiResponse> {
    const prompt = `${customPrompt}\n\nCode to Refactor:\n${code}`;
    return this.generate(prompt, [], languageLabel);
  }

  async explainCode(code: string, customPrompt: string, languageLabel: string): Promise<GeminiResponse> {
    const prompt = `${customPrompt}\n\nCode to Explain:\n${code}`;
    return this.generate(prompt, [], languageLabel);
  }
}

export const geminiService = new GeminiService();
