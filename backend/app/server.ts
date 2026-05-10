import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Example Route
app.get("/", (req: Request, res: Response) => {
  res.send("Collab Trip Planning API is running!");
});

export default app;
