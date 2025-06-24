import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

export const ensureAuthorization = async (req) => {
  const receivedJwt = req.headers["authorization"];

  if (!receivedJwt) {
    const error = new Error("토큰이 없습니다.");
    error.status = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  try {
    const decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    const { id: user_id, email } = decoded;
    console.log("🪪 JWT 디코드 결과:", decoded);

    if (!user_id || !email) {
      const error = new Error("유효하지 않은 토큰입니다.");
      error.status = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    return user_id; // ✅ DB 조회 없이 바로 user_id 리턴
  } catch (err) {
    console.error("❌ JWT 검증 실패:", err);
    err.status = err.status || StatusCodes.UNAUTHORIZED;
    throw err;
  }
};
