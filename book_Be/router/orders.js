import express from "express";
import {
  order,
  getOrders,
  getOrderDetail,
} from "../controller/oderController.js";
const router = express.Router();

// 주문하기
router.post("/", order);

// 주문 목록조회
router.get("/", getOrders);

// 주무문 상세 상품 조회
router.delete("/:id", getOrderDetail);

// 장바구니 선택한 주문 예상 상품 조회
// router.get("/carts", (req, res) => {
//   res.send("장바구니 조회");
// });

const orderApi = router;
export default orderApi;
