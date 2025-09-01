// utils/db.js
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = "payroll";

  if (!uri) {
    console.error("❌ MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName });
    console.log(`✅ MongoDB connected to database: ${dbName}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}
