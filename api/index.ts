import { app } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

export default async function handler(req: any, res: any) {
  try {
    await connectDatabase();
    // O Express 5 na Vercel funciona melhor sem o return explícito do app(req, res)
    app(req, res);
  } catch (error: any) {
    console.error("Vercel Handler Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error?.message || "Unknown error"
      });
    }
  }
}
