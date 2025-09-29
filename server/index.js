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

const start = () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server successfully started on port ${PORT}`);
  });

  app.on("error", (error) => {
    console.error("❌ Server error:", error);
    process.exit(1);
  });
};

start();
