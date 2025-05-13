import express from "express";

const router = express.Router();

// 도서 전체 조회
router.get("/", (req, res) => {
  res.send("전체 도서 조회");
});

// 개별 도서 조회
router.get("/:id", (req, res) => {
  res.send("개별 도서 조회");
});

// 카테고리별 도서 목록 조회
router.get("/", (req, res) => {
  res.send("비밀번호 초기화 요청");
});

const bookApi = router;
export default bookApi;
