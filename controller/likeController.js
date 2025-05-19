import { Result } from "express-validator";
import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

// 좋아요 추가
export const addLike = (req, res) => {
  const { id } = req.params; //book id
  const { user_id } = req.body;

  const checkSql = `SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  connection.query(checkSql, [user_id, id], (err, rows) => {
    if (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "에러 발생", err });
    }

    if (rows.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 좋아요를 누르셨습니다." });
    }

    const insertSql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    connection.query(insertSql, [user_id, id], (err, result) => {
      if (err) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "삽입 중 에러", err });
      }

      return res.status(StatusCodes.OK).json({ message: "좋아요 추가 완료" });
    });
  });
};

// 좋아요 삭제
export const removeLike = (req, res) => {
  const { id } = req.params; // liked_book_id
  const { user_id } = req.body;

  const checkSql = `SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  const deleteSql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  const values = [user_id, id];

  // 먼저 좋아요 여부 확인
  connection.query(checkSql, values, (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "DB 확인 중 에러 발생", err });
    }

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "이미 좋아요가 취소된 상태입니다." });
    }

    // 존재할 경우 삭제 진행
    connection.query(deleteSql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "삭제 중 에러 발생", err });
      }

      return res.status(StatusCodes.OK).json({
        message: "좋아요가 성공적으로 취소되었습니다.",
        result,
      });
    });
  });
};
