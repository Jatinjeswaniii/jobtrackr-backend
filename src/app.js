import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("JobTrackr API running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Global error handler (MUST BE LAST)
app.use(errorHandler);

export default app;
