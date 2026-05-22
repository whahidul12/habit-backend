import Habits from "../models/Habits.js";
import HabitsLog from "../models/HabitsLog.js";
import AIinsight from "../models/AIinsight.js";
import { chatCompletion, SYSTEM_PROMPTS } from "../utils/aiService.js";
import { calcStreak, lastNDays, todayKey } from "../utils/dateHelper.js";

const buildWeeklyContext = async (userId) => {
  const habits = await Habits.find({ userId, isArchived: false });
  const days = lastNDays(7);
  const logs = await HabitsLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });
  const preHabit = habits.map((h) => {
    const completed = logs.filter(
      (l) => String(l.habitId) === String(h._id),
    ).length;
    return {
      name: h.name,
      category: h.category,
      frequency: h.frequency,
      completedDays: completed,
      targetDays: h.targetDays,
    };
  });
  return { days, preHabit };
};

export const weeklyReport = async (req, res) => {
  try {
    const ctx = await buildWeeklyContext(req.user._id);
    if (!ctx.preHabit.length) {
      return res.json({
        content:
          "You don't have any active habits yet, Create your first habit to start tracking - I'll generate a weekly report once you have some data.",
      });
    }
    const userMsg = `Here is the user's habit data for the past 7 days (${ctx.days[0]} to ${ctx.days[6]}): \n\n${ctx.preHabit
      .map((h) => {
        return `- ${h.name} (${h.category}, ${h.frequency}): completed ${h.completedDays} of the past 7 days, target ${h.targetDays}/week`;
      })
      .join("\n")}\n\nPlease write the personalised weekly report now.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.weekly,
      user: userMsg,
    });

    await AIinsight.create({
      userId: req.user._id,
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
    const userMsg = `User goals: ${goals || "not provided"} \nMost productive time: ${productiveTime || "not provided"} \nPast struggles: ${struggles || "not provided"}\n\nSuggest 3 personalised habits now. Return JSON only.`;
    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.suggestion,
      user: userMsg,
    });
    let suggestions = [];
    try {
      const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
      suggestions = parsed.suggestions || [];
    } catch (err) {
      suggestions = [];
    }
    if (!suggestions.length) {
      suggestions = [
        {
          name: "10-minute morning walk",
          description: "Start the day with light movement and fresh air",
          frequency: "daily",
          category: "Fitness",
          icon: "🏃‍♂️",
          reason: "Low-friction way to build consistency early in the day",
        },
        {
          name: "Read 5 pages",
          description: "Short daily reading to build a learning routine",
          frequency: "daily",
          category: "Learning",
          icon: "📚",
          reason: "Compound into significant knowledge over weeks.",
        },
        {
          name: "2 minutes of mindful breathing",
          description: "Pause and breathe to reset focus and reduce stress.",
          frequency: "daily",
          category: "Mindfulness",
          icon: "🍀",
          reason: "Tiny anchor habit that fits any schedule.",
        },
      ];
    }
    await AIinsight.create({
      userId: req.user._id,
      type: "suggestion",
      content: JSON.stringify(suggestions),
      meta: { goals, productiveTime, struggles },
    });
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const recoveryPlan = async (req, res) => {
  try {
    const { habitId } = req.body;
    const habit = await Habits.findOne({
      _id: habitId,
      userId: req.user._id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const logs = await HabitsLog.find({
      userId: req.user._id,
      habitId,
    }).sort({ completedDate: -1 });

    const keys = logs.map((l) => l.completedDate);
    const { current, longest } = calcStreak(keys);

    const userMsg = `Habit: ${habit.name} (${habit.category}).\nDescription: ${habit.description || "none"}\nCurrent Streak: ${current} days. Longest ever: ${longest} days. The user just broke a streak. Write a warm, actionable 3-days recovery plan.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.recovery,
      user: userMsg,
    });
    await AIinsight.create({
      userId: req.user._id,
      type: "recovery",
      content,
      meta: { habitId },
    });
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const chatAnalysis = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ message: "Question is required!" });

    const habits = await Habits.find({
      userId: req.user._id,
      isArchived: false,
    });

    const days = lastNDays(30);
    const logs = await HabitsLog.find({
      userId: req.user._id,
      completedDate: { $gte: days[0], $lte: days[days.length - 1] },
    });

    const context = habits
      .map((h) => {
        const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
        const byDayOfWeek = [0, 0, 0, 0, 0, 0, 0];
        for (const l of hLogs) {
          const dayOfWeek = new Date(l.completedDate).getDay();
          byDayOfWeek[dayOfWeek] += 1;
        }
        return `${h.name} (${h.category}): ${hLogs.length}/30 in last 30 days, by weekday [sun,Mon,Tue,Wed,Thu,Fri, Sat] ${byDayOfWeek}`;
      })
      .join("\n");

    const userMsg = `User question: "${question}"\n\nUser data (last 30 days):\n${context}\n\nAnswer now.`;
    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.chat,
      user: userMsg,
    });

    await AIinsight.create({
      userId: req.user._id,
      type: "chat",
      content,
      meta: { question },
    });
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const morningMotivation = async (req, res) => {
  try {
    const habits = await Habits.find({
      userId: req.user._id,
      isArchived: false,
    });
    if (!habits.length) {
      return res.json({
        content:
          "Good morning! Add your first habit today and let's get the momentum started.",
      });
    }

    const days = lastNDays(30);
    const logs = await HabitsLog.find({
      userId: req.user._id,
      completedDate: { $gte: days[0], $lte: days[days.length - 1] },
    });

    const ctx = habits
      .map((h) => {
        const hLogs = logs
          .filter((l) => String(l.habitId) === String(h._id))
          .map((l) => l.completedDate)
          .sort()
          .reverse();

        const { current, longest } = calcStreak(hLogs);
        return `${h.name}: current streak ${current}`;
      })
      .join("\n");

    const today = todayKey();
    const todayLogs = logs.filter((l) => l.completedDate === today);
    const done = todayLogs.length;
    const total = habits.length;

    const userMsg = `Today's habits and streaks:\n${ctx}\n\nDone today: ${done}/${total}. Write the morning motivation.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.morning,
      user: userMsg,
      temperature: 0.8,
    });

    await AIinsight.create({
      userId: req.user._id,
      type: "morning",
      content,
    });

    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
