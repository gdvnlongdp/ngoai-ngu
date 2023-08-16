import { config } from "dotenv";

config({ path: ".env" });

export const PORT = process.env.PORT || 8000;
export const SECRET_KEY = process.env.SECRET_KEY || "core";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/core";
