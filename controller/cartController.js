import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

//장바구니  등록
export const addToCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  if (!book_id || !quantity || !user_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "모든 값을 입력하세요." });
  }

  const checkSql = `SELECT * FROM cartItems WHERE book_id = ? AND user_id = ?`;
  connection.query(checkSql, [book_id, user_id], (err, rows) => {
    if (err)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "확인 중 오류", err });

    if (rows.length > 0) {
      // 이미 있음 → 수량 증가
      const updateSql = `UPDATE cartItems SET quantity = quantity + ? WHERE book_id = ? AND user_id = ?`;
      return connection.query(
        updateSql,
        [quantity, book_id, user_id],
        (err, result) => {
          if (err)
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: "업데이트 실패", err });
          return res
            .status(StatusCodes.OK)
            .json({ message: "수량 증가", result });
        }
      );
    }

    // 없으면 새로 추가
    const insertSql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    connection.query(insertSql, [book_id, quantity, user_id], (err, result) => {
      if (err)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "추가 실패", err });
      return res
        .status(StatusCodes.OK)
        .json({ message: "장바구니 추가 완료", result });
    });
  });
};

// 장바구니 아이템 조회
// selected가 배열일 경우 → IN (?) 오류 발생	IN (?)은 배열일 땐 전개 필요
// 예외 처리 보강	값 없을 때 체크
export const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;

  if (!user_id || !Array.isArray(selected) || selected.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "유효하지 않은 요청입니다." });
  }

  const sql = `
    SELECT cartItems.id, book_id, title, summary, quantity, price
    FROM cartItems
    INNER JOIN books ON cartItems.book_id = books.id
    WHERE cartItems.user_id = ?
      AND cartItems.id IN (${selected.map(() => "?").join(",")})
  `;
  const values = [user_id, ...selected];

  connection.query(sql, values, (err, result) => {
    if (err)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "조회 실패", err });
    return res.status(StatusCodes.OK).json(result);
  });
};

// 장바구니 삭제
export const removeCartItem = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cartItems WHERE id = ?";

  connection.query(sql, [id], (err, result) => {
    if (err)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "삭제 실패", err });

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 항목이 존재하지 않습니다." });
    }

    return res.status(StatusCodes.OK).json({ message: "삭제 성공", result });
  });
};
