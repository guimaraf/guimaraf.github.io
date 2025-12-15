import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é um editor especialista e especialista em comunicação clara. 
Sua tarefa é receber um texto bruto (que pode ser de um PDF, DOCX ou TXT) e reorganizá-lo para máxima clareza e legibilidade.

Regras Estritas de Formatação:
1. Mantenha o idioma original do texto.
2. Use Markdown para formatar o texto.
3. Use títulos claros (H2, H3) para separar seções lógicas.
4. Use bullet points para listas quando apropriado para melhorar a leitura.
5. **CRUCIAL**: Sempre deixe uma linha vazia extra entre cada tópico, parágrafo ou seção abordada. O texto deve "respirar".
6. Corrija erros gramaticais óbvios, mas não altere o sentido do conteúdo.
7. Se o texto for muito longo, faça um resumo executivo no início, seguido pelos detalhes organizados.
8. Não adicione introduções conversacionais como "Aqui está o texto organizado". Apenas entregue o documento formatado.
`;

export const reorganizeTextWithGemini = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Reorganize o seguinte texto seguindo as instruções de clareza e espaçamento:\n\n${text}` }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for more deterministic/focused output
      }
    });

    return response.text || "Não foi possível gerar o texto organizado.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao processar o texto com IA. Verifique sua chave de API ou tente novamente.");
  }
};