import express from "express";
import dotenv from "dotenv";
import routers from "./router/index.js";

const app = express();
dotenv.config();

app.listen(process.env.PORT);
app.use(express.json());
console.log(`${process.env.PORT}서버 실행중`);

app.use("/", routers);

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception 발생:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection 발생:", reason);
});
