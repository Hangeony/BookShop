import express from "express";
import { addLike, removeLike } from "../controller/likeController.js";
const router = express.Router();

// 좋아요 추가
router.post("/:id", addLike);

// 좋아요 삭제
router.delete("/:id", removeLike);

const likeAPi = router;
export default likeAPi;
