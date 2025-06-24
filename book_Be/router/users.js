import express from "express";
import {
  joinUser,
  loginUser,
  passwordResetRequset,
  passwordRest,
} from "../controller/userController.js";

const router = express.Router();

// 회원가입
router.post("/join", joinUser);

// 로그인
router.post("/login", loginUser);

// 비밀번호 초기화 요청
router.post("/reset", passwordResetRequset);

// 비밀번호 초기화
router.put("/reset", passwordRest);

const userApi = router;
export default userApi;
