import express from "express";
import Incident from "../models/incident.js";
import userAuth from "../middleware/auth.js";
import restrictTo from "../middleware/restrict.js";

   const dashboardRouter = express.Router();

       dashboardRouter.get("/stats", userAuth, restrictTo("admin", "superadmin"), async (req, res) => {
    try {
       const totalIncidents = await Incident.countDocuments();

         const statusStats = await Incident.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
                  ]);

            const categoryStats = await Incident.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
           { $sort: { count: -1 } },
                ]);

           const resolvedIncidents = await Incident.find({
                  status: "resolved",
             resolvedAt: { $exists: true },
               });

          let avgResolutionTime = 0;

              if (resolvedIncidents.length > 0) {
                let totalTime = 0;

               resolvedIncidents.forEach((item) => {
        const diff =
          new Date(item.resolvedAt).getTime() -
             new Date(item.createdAt).getTime();
        totalTime += diff;
            });

          avgResolutionTime = Math.round(
           totalTime / resolvedIncidents.length / (1000 * 60 * 60)
      ); 
    }

          res.json({
      totalIncidents,
        statusStats,
         categoryStats,
      avgResolutionTime,
         });
        } catch (err) {
           res.status(500).json({ error: "Failed to load dashboard stats" });
        }
         });

     export default dashboardRouter;
