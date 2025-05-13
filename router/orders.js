import express from "express";
const router = express.Router();

// 주문하기
router.post("/", (req, res) => {
  res.send("주문하기 ");
});

// 주문 목록조회
router.get("/", (req, res) => {
  res.send("주문 목록조회");
});

// 주무문 상세 상품 조회
router.delete("/:id", (req, res) => {
  res.send("장바구니 도서 삭제");
});

// 장바구니 선택한 주문 예상 상품 조회
// router.get("/carts", (req, res) => {
//   res.send("장바구니 조회");
// });

const orderApi = router;
export default orderApi;
