import express from "express";
import {
  addToCart,
  getCartItems,
  removeCartItem,
} from "../controller/cartController.js";
const router = express.Router();

// 장바구니 담기
router.post("/", addToCart);

// 장바구니 조회 , 선택한 아이템을 따로 조회
router.get("/", getCartItems);

// 장바구니 도서 삭제
router.delete("/:id", removeCartItem);

const cartApi = router;
export default cartApi;
