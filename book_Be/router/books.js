import express from "express";
import { allBooks, datailBook } from "../controller/bookController.js";
const router = express.Router();

// 도서 전체 조회 및 카테고리 구분
router.get("/", allBooks);

// 개별 도서 조회
router.get("/:id", datailBook);

const bookApi = router;
export default bookApi;
