import express from "express";
const router = express.Router();
import { allCategory } from "../controller/categoryController.js";

router.get("/", allCategory); //카테고리 전체 목록조회

const categoryApi = router;
export default categoryApi;
