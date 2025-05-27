import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";
import { ensureAuthorization } from "../utils/ensureAuthorization.js";

//장바구니  등록
export const addToCart = async (req, res) => {
  const { book_id, quantity } = req.body;

  if (!book_id || !quantity) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "모든 값을 입력하세요." });
  }

  try {
    const user_id = await ensureAuthorization(req); // ✅ 토큰에서 user_id 추출

    const checkSql = `SELECT * FROM cartItems WHERE book_id = ? AND user_id = ?`;
    const [rows] = await connection.query(checkSql, [book_id, user_id]);

    if (rows.length > 0) {
      const updateSql = `UPDATE cartItems SET quantity = quantity + ? WHERE book_id = ? AND user_id = ?`;
      const [result] = await connection.query(updateSql, [
        quantity,
        book_id,
        user_id,
      ]);

      return res.status(StatusCodes.OK).json({
        message: "수량 증가",
        result,
      });
    }

    const insertSql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    const [result] = await connection.query(insertSql, [
      book_id,
      quantity,
      user_id,
    ]);

    return res.status(StatusCodes.OK).json({
      message: "장바구니 추가 완료",
      result,
    });
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "서버 오류 발생", error: err });
  }
};

// 장바구니 아이템 조회
// selected가 배열일 경우 → IN (?) 오류 발생	IN (?)은 배열일 땐 전개 필요
// 예외 처리 보강	값 없을 때 체크
export const getCartItems = async (req, res) => {
  const { selected } = req.body;

  if (!Array.isArray(selected) || selected.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "조회할 항목이 없습니다." });
  }

  try {
    const user_id = await ensureAuthorization(req); // ✅ 여기서 user_id 추출

    const sql = `
      SELECT cartItems.id, book_id, title, summary, quantity, price
      FROM cartItems
      INNER JOIN books ON cartItems.book_id = books.id
      WHERE cartItems.user_id = ?
        AND cartItems.id IN (${selected.map(() => "?").join(",")})
    `;
    const values = [user_id, ...selected];

    const [result] = await connection.query(sql, values);
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "장바구니 조회 중 오류", error: err });
  }
};

// 장바구니 삭제
export const removeCartItem = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cartItems WHERE id = ?";

  try {
    const [result] = await connection.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 항목이 존재하지 않습니다." });
    }

    return res.status(StatusCodes.OK).json({ message: "삭제 성공", result });
  } catch (err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "삭제 실패", error: err });
  }
};
