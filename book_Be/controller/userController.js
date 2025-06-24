import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// ✅ 회원가입
export const joinUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 [회원가입] 요청 바디:", req.body);

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "이메일과 비밀번호를 모두 입력해주세요." });
  }

  try {
    const [existing] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 가입된 이메일입니다." });
    }

    const salt = crypto.randomBytes(10).toString("base64");
    const hashPwd = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    const [result] = await connection.query(
      "INSERT INTO users(email, password, salt) VALUES (?, ?, ?)",
      [email, hashPwd, salt]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "회원가입 완료",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("❌ 회원가입 실패:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "DB 오류", error: err });
  }
};

// ✅ 로그인
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "존재하지 않는 이메일입니다." });
    }

    const hashPwd = crypto
      .pbkdf2Sync(password, user.salt, 10000, 10, "sha512")
      .toString("base64");

    if (hashPwd !== user.password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "5m",
        issuer: "songa",
      }
    );

    res.cookie("token", token, { httpOnly: true });

    return res.status(StatusCodes.OK).json({
      message: "로그인 성공",
      email: user.email,
    });
  } catch (err) {
    console.error("❌ 로그인 오류:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "로그인 중 오류", error: err });
  }
};

// ✅ 비밀번호 재설정 요청
export const passwordResetRequset = async (req, res) => {
  const { email } = req.body;

  try {
    const [results] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "해당 이메일이 존재하지 않습니다." });
    }

    return res.status(StatusCodes.OK).json({ message: "이메일 확인 완료" });
  } catch (err) {
    console.error("❌ 이메일 확인 오류:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "DB 오류", error: err });
  }
};

// ✅ 비밀번호 재설정
export const passwordRest = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "이메일과 새로운 비밀번호가 필요합니다." });
  }

  try {
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPwd = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    const [result] = await connection.query(
      "UPDATE users SET password = ?, salt = ? WHERE email = ?",
      [hashPwd, salt, email]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 이메일을 찾을 수 없습니다." });
    }

    return res.status(StatusCodes.OK).json({ message: "비밀번호 변경 완료" });
  } catch (err) {
    console.error("❌ 비밀번호 변경 오류:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "비밀번호 변경 중 오류", error: err });
  }
};
