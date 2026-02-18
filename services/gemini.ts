import { GoogleGenAI } from "@google/genai";

export async function analyzeDeal(data: any, mode: string) {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return "AI Analysis is currently disabled. Please add a valid API_KEY to your environment variables to unlock professional deal insights.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Act as a senior real estate investment advisor. Analyze this ${mode} scenario:
  ${JSON.stringify(data, null, 2)}
  
  Provide:
  1. A one-sentence 'Verdict'.
  2. Key financial strengths.
  3. Potential risks or 'Stress Test' warnings.
  4. One actionable piece of advice.
  
  Keep the tone professional, concise, and helpful. Use markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate analysis at this time.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Error connecting to Gemini. Please verify your API key.";
  }
}