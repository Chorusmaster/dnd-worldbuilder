import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

async function clearDB() {
  try {
    if (!MONGODB_URI) {
      return;
    }

    await mongoose.connect(MONGODB_URI);

    await mongoose.connection.dropDatabase();

    console.log("Database cleared");
  } finally {
    await mongoose.disconnect();
  }
}

clearDB();