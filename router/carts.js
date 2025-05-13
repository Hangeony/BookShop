import express from "express";
const router = express.Router();

// 장바구니 담기
router.post("/", (req, res) => {
  res.send("장바구니 담기");
});

// 장바구니 조회
router.get("/", (req, res) => {
  res.send("장바구니 조회");
});

// 장바구니 도서 삭제
router.delete("/:id", (req, res) => {
  res.send("장바구니 도서 삭제");
});

// 장바구니 선택한 주문 예상 상품 조회
// router.get("/carts", (req, res) => {
//   res.send("장바구니 조회");
// });

const cartApi = router;
export default cartApi;
