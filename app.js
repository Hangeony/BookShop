import express from "express";
import dotenv from "dotenv";
import routers from "./router/index.js";

const app = express();
dotenv.config();

app.listen(process.env.PORT);
app.use(express.json());
console.log(`${process.env.PORT}서버 실행중`);

app.use("/users", routers);
