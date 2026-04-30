import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const bootstrap = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void bootstrap();
