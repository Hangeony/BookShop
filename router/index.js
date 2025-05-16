import express from "express";
import userApi from "./users.js";
import bookApi from "./books.js";
import likeApi from "./likes.js";
import cartApi from "./carts.js";
import orderApi from "./orders.js";
import categoryApi from "./category.js";

const routers = express.Router();

routers.use("/users", userApi);
routers.use("/books", bookApi);
routers.use("/likes", likeApi);
routers.use("/cart", cartApi);
routers.use("/orders", orderApi);
routers.use("/category", categoryApi);

export default routers;
