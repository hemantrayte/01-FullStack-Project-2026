import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    entityType: {
      type: String,
      enum: ["workspace", "board", "column", "task", "comment"],
      required: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model(
  "ActivityLog",
  activityLogSchema
);
