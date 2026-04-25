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

export const getAIReadingRecommendations = async (interests: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بناءً على الاهتمامات التالية: "${interests}"، اقترح 3 كتب أو مقالات مع ملخص بنقطة واحدة لكل منها.`,
      config: {
        systemInstruction: "أنت مساعد ذكي تقترح كتباً ومقالات للنمو المشترك للأزواج. قدم الإجابة باللغة العربية بتنسيق نصي مرتب ومختصر جداً.",
        temperature: 0.7,
      }
    });

    return response.text || 'عذراً، لم أستطع توليد توصيات قراءة حالياً.';
  } catch (error) {
    console.error('AI Reading Recommendations Error:', error);
    return 'تعذر استدعاء المستشار الذكي للقراءة.';
  }
};

export const planFutureOrbit = async (settings: any, category: string, budget: number): Promise<string> => {
  try {
    const stylePrompt = {
      'romantic': 'رومانسي وشاعري جداً، يركز على العواطف والتواصل العميق',
      'practical': 'عملي وتقني، يركز على الأنشطة المحددة والفوائد',
      'funny': 'مرح وفكاهي، يمزح ويقترح أنشطة مسلية وتنافسية',
      'calm': 'هادئ وداعم، يركز على الاسترخاء والسلام الداخلي'
    }[settings.responseStyle as string] || 'متوازن';

    const prompt = `
      بناءً على الإعدادات التالية:
      - الأسلوب: ${stylePrompt}
      - طول الرد: ${settings.responseLength === 'short' ? 'مختصر جداً' : settings.responseLength === 'detailed' ? 'تفصيلي جداً' : 'متوسط'}
      - الجرأة المالية: ${settings.financialBoldness === 'luxury' ? 'اقتراحات فاخرة وتجارب فريدة بغض النظر عن التكلفة قليلاً' : 'اقتصادية ومدروسة وفي حدود الميزانية بدقة'}
      - الموقع المفضل: ${settings.location || 'غير محدد'}
      - التفضيلات الإضافية: ${settings.userPreferences || 'لا توجد تفضيلات محددة'}
      
      المطلوب:
      اقترح خطة أو نشاط لقضاء "آفاق الغد" (Future Orbit) للتصنيف "${category}" بميزانية لا تتجاوز ${budget} ريال.
      اكتب الخطة باللغة العربية.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت المخطط الذكي في تطبيق 'كون'. قم بإنشاء اقتراح موعد مميز بناءً على المعطيات.",
        temperature: 0.7,
      }
    });

    return response.text || 'عذراً، لم أتمكن من توليد الخطة.';
  } catch (error) {
    console.error('AI Planning Error:', error);
    return 'تعذر التخطيط عبر الذكاء الاصطناعي.';
  }
};

export const getAITherapistAdvice = async (mentalLoad: string, stressLevel: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `مستوى التوتر الحالي: ${stressLevel}/10.\nالحمل الذهني والأفكار: ${mentalLoad}\n\nقدم تحليلاً سريعاً وحلولاً علمية وعملية (مثل تمارين تنفس أو إعادة تأطير إدراكي) للتخفيف من هذا التوتر.`,
      config: {
        systemInstruction: "أنت مستشار نفسي وتقليل توتر (AI Therapist). ردودك يجب أن تكون دافئة، علمية (CBT أو Mindfulness)، ومختصرة في فقرتين أو ثلاث كحد أقصى.",
        temperature: 0.7,
      }
    });
    return response.text || 'عذراً، لم أتمكن من معالجة الموقف حالياً.';
  } catch (error) {
    console.error('AI Therapist Error:', error);
    return 'تعذر الاتصال بالمستشار النفسي.';
  }
};
export const getAINoorDailyContent = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "شارك إشراقة إيمانية سريعة: آية، حديث، أو قصة إسلامية قصيرة مليئة بالحكمة والأمل.",
      config: {
        systemInstruction: "أنت المساعد الديني (نور). تقدم إضاءة روحانية يومية مختصرة وملهمة.",
        temperature: 0.7,
      }
    });
    return response.text || 'عذراً، المحتوى غير متوفر.';
  } catch (error) {
    console.error('AI Noor Daily Content Error:', error);
    return 'تعذر استدعاء نور.';
  }
};

export const getAINoorQuiz = async (): Promise<{ question: string, answer: string, explanation: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "قم بتوليد سؤال ديني قصير (متوسط الصعوبة) للمسابقات الثنائية. الرد يجب أن يكون بتنسيق JSON حصراً كالتالي: {\"question\": \"السؤال هنا؟\", \"answer\": \"الإجابة هنا\", \"explanation\": \"شرح قصير للسياق\"}",
      config: {
        systemInstruction: "رد فقط بـ JSON صالح بدون أي نصوص إضافية أو علامات ماركداون.",
        temperature: 0.9,
      }
    });
    
    let text = response.text || '{}';
    if (text.includes('```json')) {
      text = text.replace(/```json\n/g, '').replace(/```/g, '');
    } else if (text.includes('```')) {
      text = text.replace(/```/g, '');
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('AI Noor Quiz Error:', error);
    return {
      question: "في أي سنة للهجرة فُرض الصيام؟",
      answer: "السنة الثانية للهجرة",
      explanation: "شُرع صيام شهر رمضان في شهر شعبان من السنة الثانية للهجرة."
    };
  }
};

