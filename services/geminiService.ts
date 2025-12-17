import { GoogleGenAI, Type } from "@google/genai";

// Fix: Directly use process.env.API_KEY as per the coding guidelines.
// This assumes the API key is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recomendaciones: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    objetivo_curricular: { type: Type.STRING },
                    actividad_edtech: { type: Type.STRING },
                    herramientas_digitales: { type: Type.STRING },
                    justificacion_pedagogica: { type: Type.STRING },
                    alineacion_marco_normativo: { type: Type.STRING },
                },
                required: ["objetivo_curricular", "actividad_edtech", "herramientas_digitales", "justificacion_pedagogica", "alineacion_marco_normativo"]
            }
        }
    },
    required: ["recomendaciones"]
};


export const generateRecommendations = async (
    curriculum: string,
    devices: string,
    framework: string,
    country: string
): Promise<string> => {

    const prompt = `
        Eres un experto en tecnología educativa (EdTech) y diseño curricular para Latinoamérica. Tu tarea es analizar los objetivos curriculares, los dispositivos disponibles y el marco normativo de un país para generar recomendaciones de actividades EdTech innovadoras y prácticas.

        **Contexto:**
        1.  **País:** ${country}
        2.  **Marco Normativo Clave:**
            \`\`\`
            ${framework}
            \`\`\`
        3.  **Dispositivos Disponibles en el Colegio:** ${devices}
        4.  **Objetivos Curriculares a Trabajar:**
            \`\`\`
            ${curriculum.split('\n').filter(line => line.trim() !== '').map(line => `- ${line}`).join('\n')}
            \`\`\`

        **Instrucciones:**
        Genera una recomendación para CADA UNO de los objetivos curriculares proporcionados. Cada recomendación debe ser detallada y accionable.

        **Formato de Salida:**
        Responde ÚNICAMENTE con un objeto JSON que siga el esquema definido. El objeto debe tener una única clave "recomendaciones" que contenga un array de objetos. Cada objeto en el array representa una recomendación para un objetivo curricular.

        NO incluyas ninguna explicación, introducción, conclusión o texto adicional fuera del objeto JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            // Provide a more user-friendly message that gives context.
            throw new Error(`Ocurrió un error con la IA: ${error.message}. Por favor, revisa tu consulta e intenta de nuevo.`);
        }
        throw new Error("Hubo un problema desconocido al generar las recomendaciones. Por favor, intenta de nuevo.");
    }
};