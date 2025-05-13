import express from "express";
import userApi from "./users.js";
import bookApi from "./books.js";
import likeApi from "./likes.js";
import cartApi from "./carts.js";
import orderApi from "./orders.js";

const routers = express.Router();

routers.use("/users", userApi);
routers.use("/books", bookApi);
routers.use("/likes", likeApi);
routers.use("/cart", cartApi);
routers.use("/orders", orderApi);

export default routers;
