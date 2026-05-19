import mongoose from "mongoose";

const CATEGORISE = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Social",
  "Finance",
  "Creative",
  "Other",
];

const HabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum: CATEGORISE,
      default: "Other",
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    targetDays: {
      type: Number,
      default: 7,
      min: 1,
      max: 7,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    icon: {
      type: String,
      default: "🎯",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const HABIT_CATEGORISE = CATEGORISE;
export default mongoose.model("Habit", HabitSchema);
