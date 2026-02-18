
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDealAnalysis = async (data: any, type: 'mortgage' | 'investment') => {
  const prompt = `Analyze this real estate ${type} scenario:
    ${JSON.stringify(data, null, 2)}
    
    Provide a professional summary including:
    1. Overall deal quality (High, Medium, Low risk).
    2. Key red flags or opportunities.
    3. Advice for the buyer/investor.
    
    Keep the response concise and formatted with clear headings.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please try again later.";
  }
};
