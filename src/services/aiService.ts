import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const getAIGeneratedSuggestion = async (prompt: string, context?: string): Promise<string> => {
  try {
    const fullPrompt = context 
      ? `Context: ${context}\n\nTask: ${prompt}\n\nReturn a short, helpful, and romantic suggestion in Arabic.` 
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: "أنت خبير في العلاقات الزوجية والذكاء العاطفي. اسمك (كوكب). هدفك تقديم نصائح قصيرة، عملية، ودافئة للأزواج لتحسين حياتهم اليومية.",
        temperature: 0.8,
      }
    });

    return response.text || 'عذراً، لم أستطع توليد اقتراح حالياً.';
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'حدث خطأ في استدعاء مستشار الكوكب.';
  }
};

