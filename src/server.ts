import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "users-api-v2"
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
