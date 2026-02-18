
import { GoogleGenAI } from "@google/genai";

export const getDealAnalysis = async (data: any, type: 'mortgage' | 'investment') => {
  const apiKey = process.env.API_KEY;
  
  // If no API key is found, return a graceful message instead of crashing
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    console.warn("AI features disabled: No API_KEY found in environment variables.");
    return "The AI analysis feature is currently disabled because no Google Gemini API key was provided in the project environment. All other calculator functions remain fully operational!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this real estate ${type} scenario:
      ${JSON.stringify(data, null, 2)}
      
      Provide a professional summary including:
      1. Overall deal quality (High, Medium, Low risk).
      2. Key red flags or opportunities.
      3. Advice for the buyer/investor.
      
      Keep the response concise and formatted with clear headings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "The AI service is temporarily unavailable. Please check your API key configuration and try again.";
  }
};
