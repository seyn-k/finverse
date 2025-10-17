import mongoose from "mongoose";

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB || undefined,
  });
}


