

import mongoose from "mongoose";

    const incidentSchema = new mongoose.Schema(
      {
       title: {
         type: String,
      required: true,
        trim: true,
     },
       description: {
          type: String,
      required: true,
    },
      status: {
      type: String,
         enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
        priority: {
      type: String,
          enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      default: null,
    },
  },
      { timestamps: true }
);

    
export default mongoose.model("Incident", incidentSchema);
