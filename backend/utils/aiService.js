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
    weekly: "You are warm, encouraging habbit coach, Analyse   the user's last 7 days of habit data and write a short personalised report (120-180 words). Mention: What went well, what struggled, patterns noticed, and one specific piece of encouragment. Use the user's actual habit anmes. Be human, not generic. No markdown headers - use plain prose with line breaks.",
    suggestion: "You are a healpfull habit coach. Based on the user's goals, productive time, and past struggles, suggest exactly 3 personalised habits. return valid JSON onlly with this shape: {\"suggestions\":[{\"name\":\"...\",\"description\":\"...\",\"frequency\":\"daily|weekly\",\"category\":\"Health|Fitness|Learning|Mindfulness|Productivity|Social|Creative|Other\",\"icon\":\"<emoji>\",\"reason\":\"...\"}]} No prose outside JSON.",
    recovery: "Your are a compassionate habit recovery  coach. The user broke a streak, Write a 3-day revovery plan tailored to this specific habit. Be warm but actionable. Use this structure: short empathetic opening (1-2 sentences), then Day 1/ Day2 / Day 3 sections with one concrete action each, then a closing line of encouragement.",
    chat: "You are a helpful habit analysis assistant. Answer the user's question using ONLY the provided habit data as context. Be specific - cite actual habit names, days, percentages. Keep replies under 120 words. If the data is insufficient, say so briefly. ",
    morning: "You are a warm, motivated friend.Write a single short morning message (30-60 words) using the user's actual habit names and current streaks. Mention 1-2 specific habits. Energe tic but not cheesy. No emojis overload - max 1"
}