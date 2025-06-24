import { ensureAuthorization } from "../utils/ensureAuthorization.js";

// ✅ 좋아요 추가
export const addLike = async (req, res) => {
  const { id } = req.params; //book_id

  const user_id = await ensureAuthorization(req);

  try {
    // ✅ 좋아요 중복 체크
    const [rows] = await connection.query(
      "SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?",
      [user_id, id]
    );

    if (rows.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 좋아요를 누르셨습니다." });
    }

    // ✅ 좋아요 삽입
    await connection.query(
      "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)",
      [user_id, id]
    );

    return res.status(StatusCodes.OK).json({ message: "좋아요 추가 완료" });
  } catch (err) {
    console.error("❌ 좋아요 추가 실패:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "좋아요 처리 중 오류 발생", error: err.message });
  }
};

// ✅ 좋아요 삭제
export const removeLike = async (req, res) => {
  const { id } = req.params; // liked_book_id

  try {
    const user_id = await ensureAuthorization(req);

    // ✅ 삭제 실행
    const [result] = await connection.query(
      "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?",
      [user_id, id]
    );

    return res.status(StatusCodes.OK).json({
      message: "좋아요가 성공적으로 취소되었습니다.",
      result,
    });
  } catch (err) {
    console.error("❌ 좋아요 삭제 실패:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "좋아요 삭제 중 오류 발생", error: err.message });
  }
};
