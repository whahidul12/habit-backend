import mongoose from "mongoose";

const HabitLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habits",
      required: true,
      index: true,
    },
    completedDate: {
      type: String, //YYYY-MM-DD
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

HabitLogSchema.index(
  { userId: 1, habitId: 1, completedDate: 1 },
  { unique: true },
);

export default mongoose.model("HabitLog", HabitLogSchema);
