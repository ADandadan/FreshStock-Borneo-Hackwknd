import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateText(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
	config: {
      systemInstruction: "You are an assistant to provide insights on certain topics or findings. Limit your responses to only two sentences maximum. Keep your responses brief and concise.",
    },
  });
  return response.text;
}