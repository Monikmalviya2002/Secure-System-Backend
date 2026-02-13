import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js"
import authRouter from "./routes/auth.js";
import superadminRouter from "./routes/superadmin.js";
import incidentRouter from "./routes/incident.js"
import dashboardRouter from "./routes/dashborad.js"
import adminRouter from "./routes/adminstats.js"
import auditRouter from "./routes/auditlogs.js";
import cors from "cors"
import cookieParser from "cookie-parser";
 import path from "path";

dotenv.config();


const app = express()
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

 app.use(cors(corsOptions));
   app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/incident", incidentRouter);
app.use("/api/superadmin", superadminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/audit-logs", auditRouter);

app.use("/api/dashborad",dashboardRouter)

connectDB();

   app.listen(process.env.PORT,()=>{
    console.log("server is active")
})