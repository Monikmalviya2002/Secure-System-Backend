import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: 
    { type: String,
     required: true },

    incidentId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "Incident" }, 

    userId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "User", 
         required: true },

    ipAddress: {
         type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
