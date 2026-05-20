import { GoogleGenAI } from '@google/genai';

let client = null;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const getClient = () => {
    if (client) return client;
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    client = new GoogleGenAI({ apiKey: key });
    return client;
};


export const isAIenabled = () => !!process.env.GEMINI_API_KEY;

export const parseJSON = (text) => {
    let cleanText = (text || "").trim();

    if (cleanText.startWith("```json")) {
        cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (cleanText.startWith("```")) {
        cleanText = cleanText.replace(/```\n?/g, "");
    } return JSON.parse(cleanText);
};

export const chatCompletion = async ({ system, user, temperature = 0.7 }) => {
    const c = getClient();
    if (!c) {
        return {
            ok: false,
            content: "AI features disabled - set GEMINI_API_KEY in the baceknd .env to enable real AI response."
        };
    }
    try {
        const res = await c.models.generateContent({
            model: MODEL,
            contents: user,
            config: {
                systemInstruction: system,
                temperature
            }
        });
        return { ok: true, content: (res.text || "").trim() };
    } catch (err) {
        console.error("AI Error:", err.message);
        return { ok: false, content: "AI request faield. Please try again later." }
    }
};

export const SYSTEM_PROMPTS = {
    weekly: "",
    suggestion: "",
    recovery: "",
    chat: "",
    morning: ""
}