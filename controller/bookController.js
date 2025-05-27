import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

// 전체 도서 조회
export const allBooks = (req, res) => {
  let { category_id, new_books, limit, current_page } = req.query;

  //  limit page당 도서수 ex3
  // currentPage 현재 몇페이지 ex.1, 2,3
  // offset은 limit  * (currentPage -1)
  limit = Number(limit);
  const offset = limit * (current_page - 1);

  function runQuery(sql, values = []) {
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "err발생", err });
      }

      // 총 개수 조회
      connection.query(
        "SELECT FOUND_ROWS() AS total",
        (countErr, countResult) => {
          if (countErr) {
            console.log(countErr);
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: "카운트 조회 실패", err: countErr });
          }

          return res.status(StatusCodes.OK).json({
            total: countResult[0].total,
            data: result,
          });
        }
      );
    });
  }

  // ✅ SQL_CALC_FOUND_ROWS 포함한 쿼리문들
  if (category_id && new_books) {
    const sql = `
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
    runQuery(sql, [category_id, limit, offset]);
  } else if (category_id) {
    const sql = `
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
    runQuery(sql, [category_id, limit, offset]);
  } else if (new_books) {
    const sql = `
      SELECT SQL_CALC_FOUND_ROWS 
        b.*, 
        (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
      FROM books b
      WHERE b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
      LIMIT ? OFFSET ?
    `;
    runQuery(sql, [limit, offset]);
  } else {
    const sql = `
      SELECT SQL_CALC_FOUND_ROWS 
        b.*, 
        (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
      FROM books b
      LIMIT ? OFFSET ?
    `;
    runQuery(sql, [limit, offset]);
  }
};
export const datailBook = (req, res) => {
  let { id } = req.params;

  const sql = `
   SELECT 
    b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail,
    b.author, b.pages, b.contents, b.price, b.pub_date,
    c.name AS category,
    (SELECT COUNT(*) FROM likes WHERE liked_book_id = b.id) AS likes
  FROM books b
  INNER JOIN category c ON b.category_id = c.id
  WHERE b.id = ?;
`;
  connection.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "err발생", err });
    }
    if (result[0]) {
      return res.status(StatusCodes.OK).json(result[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "요청하신 상품은 없는 상품 입니다.",
      });
    }
  });
};
