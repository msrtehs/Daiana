
import { GoogleGenAI } from "@google/genai";

/**
 * Retrieves the Gemini API Key from process.env.API_KEY.
 * Includes logic to decode the key if it's provided in a Base64 format.
 */
const getGeminiApiKey = (): string => {
  const key = process.env.API_KEY || "";
  
  // Attempt decoding if the key is not in the standard 'AIza' format
  if (key && !key.startsWith('AIza')) {
    try {
      if (/^[A-Za-z0-9+/=]+$/.test(key)) {
        return atob(key);
      }
    } catch (e) {
      // Fallback to original key on error
    }
  }
  return key;
};

// Initialize the GoogleGenAI instance using the named parameter as required
const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

export const getAIRecommendation = async (userQuery: string, context: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      Você é a "Daiana", a assistente pessoal de beleza inteligente da plataforma.
      AJUDE o usuário com base no contexto JSON fornecido.
      Mencione sempre a opção com Melhor Preço e a Mais Popular.
      Seja elegante, concisa e use Português do Brasil.
    `;

    // Direct call to generateContent as per the latest SDK guidelines
    const response = await ai.models.generateContent({
      model,
      contents: `Context: ${context}\n\nPergunta: ${userQuery}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Directly access the .text property from the response
    return response.text || "Não consegui analisar as opções agora.";
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Tive um probleminha técnico na nuvem. Pode repetir?";
  }
};
