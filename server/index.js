import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
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
    origin: ["http://localhost:5173","https://react-pizza-blond-nine.vercel.app"],
  })
);

app.use("/api", router);

const start = async () => {
  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
