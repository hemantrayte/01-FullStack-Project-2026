import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema(
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

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Workspace = mongoose.model("Workspace", workspaceSchema);
