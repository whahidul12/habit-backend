import mongoose from 'mongoose';
import { format, subDays } from 'date-fns';
import { connectDB } from '../config/db.js';
import Users from '../models/Users.js';
import HabitsLog from '../models/HabitsLog.js';
import Habits from '../models/Habits.js';
import AIinsight from '../models/AIinsight.js';
import { createHabit, updateHabit } from '../controllers/habitController.js';

const EMAIL = "whahid@gmail.com";
const PASSWORD = "whahid123";
const NAME = "Whahidul Islam";

const HABITS = [
    {
        name: "Drink 2L of water",
        description: "Stay hydrated throughout the day",
        category: "Health",
        frequency: "daily",
        targetDays: 7,
        color: "#0ea5e9",
        icon: "💧",
        _streakProb: 0.95
    },
    {
        name: "Morning run",
        description: "Stay hydrated throughout the day",
        category: "Fitness",
        frequency: "daily",
        targetDays: 5,
        color: "#ef4444",
        icon: "🏃‍♂️",
        _streakProb: 0.7,
        _pattern: "weekdays",
        _brokeAt: 20
    },
    {
        name: "Read 20 minutes",
        description: "Fiction or non-fiction, no phone.",
        category: "Learning",
        frequency: "daily",
        targetDays: "7",
        color: "#6366f1",
        icon: "📚",
        _streakProb: 0.82
    },
    {
        name: "Meditate",
        description: "10 minutes of breath-focused meditation.",
        category: "Mindfulness",
        frequency: "daily",
        targetDays: "7",
        color: "#8b5cf6",
        icon: "🌱",
        _streakProb: 0.6
    },
    {
        name: "Journal",
        description: "Write 3 things I'm grateful for.",
        category: "Mindfulness",
        frequency: "daily",
        targetDays: "5",
        color: "#ec4899",
        icon: "✍",
        _streakProb: 0.75,
        _pattern: "dropOff"
    },
    {
        name: "Calisthenics",
        description: "Strength training for build muscle, endurance, and flexibility.",
        category: "Fitness",
        frequency: "weekly",
        targetDays: "3",
        color: "#f59e0b",
        icon: "💪",
        _streakProb: 0.82,
        _pattern: "weekdays"
    },
    {
        name: "Stay away from LOVE",
        description: "If she dosen't want them stay out of her way.",
        category: "Learning",
        frequency: "daily",
        targetDays: "7",
        color: "#eb1e95",
        icon: "💔",
        _streakProb: 0.63,
        _pattern: "dropOff"
    },
    {
        name: "No phone after 10pm",
        description: "Leave your phone outside of bedroom.",
        category: "Health",
        frequency: "daily",
        targetDays: "6",
        color: "#10b981",
        icon: "📴",
        _streakProb: 0.65
    },
    {
        name: "Side project - 1hr",
        description: "Ship something small every day.",
        category: "Productivity",
        frequency: "daily",
        targetDays: "6",
        color: "#14b8a6",
        icon: "🎯",
        _streakProb: 0.82
    }
];

const todayKey = () => format(new Date(), "yyyy-MM-dd");

const buildLogs = (habit, totalDays = 90) => {
    const logs = [];
    const today = new Date();
    for (let i = 0; i < totalDays; i++) {
        const day = subDays(today, i);
        const dayOfWeek = day.getDay();
        const key = format(day, "yyyy-MM-dd");
        let p = habit._streakProb;

        if (habit._pattern === "weekdays") {
            if (dayOfWeek === 0 || dayOfWeek === 6) p *= 0.35;
        }
        if (habit._pattern === "dropOff") {
            if (i < 14) p *= 0.25;
        }
        if (habit._brokeAt && i >= habit._brokeAt - 2 && i <= habit._brokeAt + 2) {
            continue;
        }

        const seed = Math.sin(i * 9301 + habit.name.length * 49297) * 233280;
        const rnd = seed - Math.floor(seed);
        if (rnd < p) logs.push({ completedDate: key });
    }
    return logs;
};

const run = async () => {
    await connectDB();

    let user = await Users.findOne({ email: EMAIL });
    if (user) {
        console.log(`Found existing user ${EMAIL} - clearing their data...`);
        await Habits.deleteMany({ userId: user._id });
        await HabitsLog.deleteMany({ userId: user._id });
        await AIinsight.deleteMany({ userId: user._id });
        user.name = NAME;
        user.avatar = NAME.charAt(0).toUpperCase();
        user.morningMotivation = true;
        user.password = PASSWORD;
        await user.save();
    } else {
        user = await Users.create({
            name: NAME,
            email: EMAIL,
            password: PASSWORD,
            avatar: NAME.charAt(0).toUpperCase(),
            morningMotivation: true
        });
        console.log(`Created User: ${NAME} => (email:${EMAIL})`);
    }
    const createHabit = [];
    for (let i = 0; i < HABITS.length; i++) {
        const h = HABITS[i];
        const habit = await Habits.create({
            userId: user._id,
            name: h.name,
            description: h.description,
            category: h.category,
            frequency: h.frequency,
            targetDays: h.targetDays,
            color: h.color,
            icon: h.icon,
            order: i,
            createdAt: subDays(new Date(), 89),
            updatedAt: subDays(new Date(), 89)
        });
        habit.createdAt = subDays(new Date(), 89);
        await habit.save({ timestamps: false });
        createHabit.push({ habit, config: h });
    }


    let totalLogs = 0;
    for (const { habit, config } of createHabit) {
        const logs = buildLogs(config);
        if (!logs.length) continue;
        const docs = logs.map((l) => ({
            userId: user._id,
            habitId: habit._id,
            completedDate: l.completedDate
        }));
        await HabitsLog.insertMany(docs, { ordered: false }).catch(() => { });
        totalLogs += docs.length;
    };


    const today = todayKey();
    const todayDoneHabits = createHabit.slice(0, 4).map((c) => c.habit);
    for (const h of todayDoneHabits) {
        await HabitsLog.updateOne(
            {
                userId: user._id,
                habitId: h._id,
                completedDate: today
            },
            {
                $setOnInsert: {
                    userId: user._id,
                    habitId: h._id,
                    completedDate: today
                }
            },
            { upsert: true }
        )
    };

    console.log(`\n✅ Seed Complete`);
    console.log(`✅ User:${NAME}`);
    console.log(`✅ Email:${EMAIL}`);
    console.log(`✅ Password:${PASSWORD}`);
    console.log(`✅ Habits:${createHabit.length}`);
    console.log(`✅ Logs:${totalLogs}`);

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error("Seed failed:", err);
    await mongoose.disconnect();
    process.exit(1);
});


