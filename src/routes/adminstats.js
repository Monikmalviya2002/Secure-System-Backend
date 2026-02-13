import express from "express";
import Incident from "../models/incident.js";
import userAuth from "../middleware/auth.js";
import restrictTo from "../middleware/restrict.js";

const adminRouter = express.Router();



         adminRouter.get("/stats", userAuth, restrictTo("admin", "superadmin"), async (req, res) => {
                 try {
          const totalIncidents = await Incident.countDocuments();

             const openCount = await Incident.countDocuments({ status: "open" });
             const resolvedCount = await Incident.countDocuments({ status: "resolved" });

             const categories = await Incident.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
                 ]);

              const resolvedIncidents = await Incident.find({
           status: "resolved",
              updatedAt: { $exists: true },
                });

             let avgResolutionTime = 0;

            if (resolvedIncidents.length > 0) {
             const totalTime = resolvedIncidents.reduce((sum, item) => {
        const diff = new Date(item.updatedAt) - new Date(item.createdAt);
        return sum + diff;
      }, 0);

      avgResolutionTime = Math.round(
        totalTime / resolvedIncidents.length / (1000 * 60 * 60) 
      );
    }

         res.json({
             totalIncidents,
           openVsResolved: {
        open: openCount,
        resolved: resolvedCount,
            },
          categories,
          avgResolutionTime,
               });
         } catch (err) {
    res.status(500).json({ error: "Failed to load stats" });
           }
              });

export default adminRouter;
