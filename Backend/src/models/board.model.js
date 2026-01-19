import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
      },
    ],

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
  },
  { timestamps: true }
);

export const Board = mongoose.model("Board", boardSchema);
