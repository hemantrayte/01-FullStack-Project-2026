import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
