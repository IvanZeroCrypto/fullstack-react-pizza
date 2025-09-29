import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { execSync } from "child_process";
import { router } from "./router/index.js";
dotenv.config();
const PORT = process.env.PORT || 7000;
const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://react-pizza-coral.vercel.app"],
  })
);

app.use(router);

function setupDatabase() {
  if (process.env.NODE_ENV === "production") {
    try {
      console.log("🚀 Applying database migrations...");
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
      console.log("✅ Database migrations completed");
    } catch (error) {
      console.error("❌ Database migration failed:", error);
      process.exit(1);
    }
  }
}

setupDatabase();

const start = async () => {
  setupDatabase();
  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
