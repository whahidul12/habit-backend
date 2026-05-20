import Habits from '../models/Habits.js';
import HabitsLog from '../models/HabitsLog.js';
import AIinsight from '../models/AIinsight.js';
import { chatCompletion, SYSTEM_PROMPTS } from '../utils/aiService.js';

const buildWeeklyContext = async (userId) => {
    const habits = await Habits.findOne({ userId, isArchived: false });
    const days = lastNDays(7);
    const logs = await HabitsLog.find({
        userId,
        completedDate: { $gte: days(0), $lte: days(days.length - 1) }
    });
    const preHabit = habits.map((h) => {
        const completed = logs.filter((l) => String(l.habitId) === String(h._id)).length;
        return {
            name: h.name,
            category: h.category,
            frequency: h.frequency,
            completedDate: completed,
            targetDays: h.targetDays
        }
    });
    return { days, preHabit }
};


export const weeklyReport = async (req, res) => {
    try {
        const ctx = await buildWeeklyContext(req.user._id);
        if (!ctx.preHabit.length) {
            return res.json({
                content: "You don't have any active habits yet, Create your first habit to start tracking - I,ll generate a weekly report once you have some data."
            });
        }
        const userMsg = `Here is the user's habit data for the past 7 days (${ctx.days[0]} to ${ctx.days[6]}): \n\n${ctx.preHabit
            .map((h) => {
                `- ${h.name} (${h.category}, ${h.frequency}): completed ${h.completedDays} of the past 7 days, target ${h.targetDays}/week`
            })
            .join("\n")}\n\nPlease write the personalised weeekly report now.`;

        const { content } = await chatCompletion({
            system: SYSTEM_PROMPTS.weekly,
            user: userMsg,
        });

        await AIinsight.create({
            userId: rwq.user._id,
            type: "weekly",
            content,
        });

        res.json({ content });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const suggestHabits = async (req, res) => {
    try {
        const { goals, productiveTime, struggles } = req.body;
        const userMsg = `User goals: ${goals || "not provided"} \nMost productive time: ${productiveTime || "not provided"} \nPast strugles: ${struggles || "not provided"}\n\nSuggest 3 presonalised habits now. Return JSON only.`;
    }
}