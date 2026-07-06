import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import statsRouter from "./routes/stats.js";
import { pool } from "./db.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "disconnected", message: err.message });
  }
});

app.use("/api", statsRouter);

// Centralized error handler so a bad query returns JSON, not a stack trace.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const port = Number(process.env.PORT || process.env.API_PORT || 4000);
app.listen(port, () => {
  console.log(`Restaurant dashboard API listening on http://localhost:${port}`);
  console.log(`Try it: http://localhost:${port}/api/health`);
});
