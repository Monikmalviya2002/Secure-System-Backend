import express from "express";
import AuditLogs from "../models/auditLogs.js";
import userAuth from "../middleware/auth.js";
import restrictTo from "../middleware/restrict.js";



const auditRouter = express.Router();

     auditRouter.get("/", userAuth, restrictTo("superadmin"), async (req, res) => {
           try {
        const logs = await AuditLogs.find()
           .populate("userId", "username emailId")
        .populate("incidentId", "title")
      .sort({ createdAt: -1 })
      .lean(); 

    res.json(logs);
        } catch (err) {
    console.error("AuditLogs fetch error:", err);
    res.status(500).json({ error: "Failed to load logs" });
  }
      });

    export default auditRouter;
