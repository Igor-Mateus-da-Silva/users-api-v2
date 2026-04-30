import express from "express";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "users-api-v2"
  });
});

app.use(userRoutes);
app.use(errorMiddleware);

export { app };
