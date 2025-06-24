import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

// 전체 도서 조회
export const allBooks = async (req, res) => {
  let { category_id, new_books, limit, current_page } = req.query;

  try {
    //  limit page당 도서수 ex3
    // currentPage 현재 몇페이지 ex.1, 2,3
    // offset은 limit  * (currentPage -1)
    limit = Number(limit);
    const offset = limit * (current_page - 1);

    let sql = "";
    let values = [];

    if (category_id && new_books) {
      sql = `
        SELECT SQL_CALC_FOUND_ROWS 
          b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail,
          b.author, b.pages, b.contents, b.price, b.pub_date,
          c.name AS category,
          (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
        FROM books b
        INNER JOIN category c ON b.category_id = c.id
        WHERE b.category_id = ?
          AND b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
        LIMIT ? OFFSET ?
      `;
      values = [category_id, limit, offset];
    } else if (category_id) {
      sql = `
        SELECT SQL_CALC_FOUND_ROWS 
          b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail,
          b.author, b.pages, b.contents, b.price, b.pub_date,
          c.name AS category,
          (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
        FROM books b
        INNER JOIN category c ON b.category_id = c.id
        WHERE b.category_id = ?
        LIMIT ? OFFSET ?
      `;
      values = [category_id, limit, offset];
    } else if (new_books) {
      sql = `
        SELECT SQL_CALC_FOUND_ROWS 
          b.*, 
          (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
        FROM books b
        WHERE b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
        LIMIT ? OFFSET ?
      `;
      values = [limit, offset];
    } else {
      sql = `
        SELECT SQL_CALC_FOUND_ROWS 
          b.*, 
          (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
        FROM books b
        LIMIT ? OFFSET ?
      `;
      values = [limit, offset];
    }

    const [data] = await connection.query(sql, values);
    const [countResult] = await connection.query(
      "SELECT FOUND_ROWS() AS total"
    );

    return res.status(StatusCodes.OK).json({
      total: countResult[0].total,
      data,
    });
  } catch (err) {
    console.error("❌ 도서 조회 실패:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류 발생", error: err });
  }
};
export const datailBook = async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail,
      b.author, b.pages, b.contents, b.price, b.pub_date,
      c.name AS category,
      (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
    FROM books b
    INNER JOIN category c ON b.category_id = c.id
    WHERE b.id = ?
  `;

  try {
    const [result] = await connection.query(sql, [id]);

    if (result.length > 0) {
      return res.status(StatusCodes.OK).json(result[0]);
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "요청하신 상품은 없는 상품 입니다." });
    }
  } catch (err) {
    console.error("❌ 상세 조회 실패:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류 발생", error: err });
  }
};
