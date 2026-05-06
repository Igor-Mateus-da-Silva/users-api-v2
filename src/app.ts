import express from "express";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "users-api-v2" });
});

app.use(userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Users API v2 online",
    status: "ok"
  });
});

app.use(errorMiddleware);

export { app };
