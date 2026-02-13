import express from "express";
import User from "../models/user.js";
import userAuth from "../middleware/auth.js";
import restrictTo from "../middleware/restrict.js";

  const superadminRouter = express.Router();


         superadminRouter.get("/", userAuth, restrictTo("superadmin"), async (req, res) => {
            try {
                const users = await User.find().select("-password");
         res.status(200).json(users);
              } catch (err) {
          res.status(500).json({ error: "Failed to fetch users" });
              }
           });


    superadminRouter.patch("/:id/role", userAuth, restrictTo("superadmin"), async (req, res) => {
           try {
          const { role } = req.body;

         if (!role) {
      return res.status(400).json({ error: "Role is required" });
            }

          if (role !== "user" && role !== "admin" && role !== "superadmin") {
      return res.status(400).json({ error: "Invalid role" });
    }

       const user = await User.findById(req.params.id);

           if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    if (user.role === "superadmin" && role !== "superadmin") {
      const superAdminCount = await User.countDocuments({ role: "superadmin" });
        if (superAdminCount === 1) {
        return res
            .status(400)
        .json({ error: "At least one superadmin is required" });
        }
    }

        user.role = role;
      await user.save();

        const userData = user.toObject();
           delete userData.password;

       res.status(200).json(userData);
       } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
    }
      });

          superadminRouter.patch("/:id/block", userAuth, restrictTo("superadmin"), async (req, res) => {
          try {
         const { isBlocked } = req.body;

       const user = await User.findById(req.params.id);

         if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

         user.isBlocked = isBlocked;
         await user.save();

         const userData = user.toObject();
           delete userData.password;

         res.status(200).json(userData);
        } catch (err) {
          res.status(500).json({ error: "Failed to update user status" });
     }
       });


         export default superadminRouter;
