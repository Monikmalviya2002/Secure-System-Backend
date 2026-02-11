import express from "express";
import Incident from "../models/incident.js";
import AuditLog from "../models/auditLog.js";
import userAuth from "../middleware/userAuth.js";
import restrictTo from "../middleware/restrictTo.js";

     const incidentrouter = express.Router();


         incidentrouter.post("/", userAuth, restrictTo("user", "admin", "superadmin"), async (req, res) => {
           try {
      
            const { title, description, priority } = req.body;

          const incident = new Incident({
            title,
          description,
           priority,
         createdBy: req.user._id,
             });

        await incident.save();

           await AuditLog.create({
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


     incidentrouter.patch("/:id", userAuth, restrictTo("admin", "superadmin"), async (req, res) => {
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

         await AuditLog.create({
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


    incidentrouter.delete("/:id", userAuth, restrictTo("superadmin"), async (req, res) => {
     try {
       const incident = await Incident.findByIdAndDelete(req.params.id);

        if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

          await AuditLog.create({
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

  export default router;
