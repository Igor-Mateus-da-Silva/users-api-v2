import mongoose from "mongoose";

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
};
