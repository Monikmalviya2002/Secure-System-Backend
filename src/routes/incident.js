import express from "express";
import Incident from "../models/incident.js";
import AuditLogs from "../models/auditLogs.js";
import userAuth from "../middleware/auth.js";
import restrictTo from "../middleware/restrict.js";
import upload from "../middleware/upload.js";

     const incidentRouter = express.Router();


         incidentRouter.post("/", userAuth, restrictTo("user", "admin", "superadmin"), upload.single("evidence"),
          async (req, res) => {
           try {
      
        const { title, description, priority } = req.body;

          const incident = new Incident({
            title,
          description,
           priority,
         createdBy: req.user._id,
         evidence: req.file ? req.file.path : null,
             });

        await incident.save();

           await AuditLogs.create({
           action: "create",
         incidentId: incident._id,
        userId: req.user._id,
           ipAddress: req.ip,
             });

          res.status(201).json(incident);
             } catch (err) {
        res.status(500).json({ error: "Failed to create incident" });
              }
          });


     incidentRouter.patch("/:id", userAuth, restrictTo("admin", "superadmin"), async (req, res) => {
              try {
        const incident = await Incident.findById(req.params.id);

              if (!incident) {
       return res.status(404).json({ error: "Incident not found" });
    }

           const { status, priority, assignedTo } = req.body;

          if (status) incident.status = status;
             if (priority) incident.priority = priority;
     if (assignedTo) incident.assignedTo = assignedTo;

           await incident.save();

         await AuditLogs.create({
        action: "update",
       incidentId: incident._id,
        userId: req.user._id,
      ipAddress: req.ip,
           });

     res.json(incident);
    } catch (err) {
     res.status(500).json({ error: "Failed to update incident" });
      }
        });


    incidentRouter.delete("/:id", userAuth, restrictTo("superadmin"), async (req, res) => {
     try {
       const incident = await Incident.findByIdAndDelete(req.params.id);

        if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

          await AuditLogs.create({
      action: "delete",
         incidentId: incident._id,
      userId: req.user._id,
        ipAddress: req.ip,
        });

       res.json({ message: "Incident deleted successfully" });
        } catch (err) {
       res.status(500).json({ error: "Failed to delete incident" });
        }
     });

  export default incidentRouter;
