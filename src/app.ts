import express from "express";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Users API v2 online",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "users-api-v2",
    uptime: process.uptime()
  });
});

app.use(userRoutes);
app.use(errorMiddleware);

export { app };
