import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

// 전체 도서 조회
export const allBooks = (req, res) => {
  let { category_id, new_books, limit, current_page } = req.query;

  //  limit page당 도서수 ex3
  // currentPage 현재 몇페이지 ex.1, 2,3
  // offset은 limit  * (currentPage -1)

  // 공통 함수
  limit = Number(limit); //문자열을 숫자로 반환
  let offset = limit * (current_page - 1);

  function runQuery(sql, values = []) {
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "err발생", err });
      }

      if (result.length > 0) {
        return res.status(StatusCodes.OK).json(result);
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "요청하신 상품은 없는 상품 입니다.",
        });
      }
    });
  }

  if (category_id && new_books) {
    const sql = `
    SELECT b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail,
           b.author, b.pages, b.contents, b.price, b.pub_date,
           c.name AS category
    FROM books b
    INNER JOIN category c ON b.category_id = c.id
    WHERE b.category_id = ?
      AND b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
    ORDER BY b.pub_date DESC
    LIMIT ? OFFSET ?
  `;
    runQuery(sql, [category_id, limit, offset]);
  } else if (category_id) {
    const sql = `
    SELECT b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail,
           b.author, b.pages, b.contents, b.price, b.pub_date,
           c.name AS category
    FROM books b
    INNER JOIN category c ON b.category_id = c.id
    WHERE b.category_id = ?
    ORDER BY b.pub_date DESC
    LIMIT ? OFFSET ?
  `;
    runQuery(sql, [category_id, limit, offset]);
  } else if (new_books) {
    const sql = `
    SELECT * FROM books
    WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
    ORDER BY pub_date DESC
    LIMIT ? OFFSET ?
  `;
    runQuery(sql, [limit, offset]);
  } else {
    const sql = `
    SELECT * FROM books
    ORDER BY pub_date DESC
    LIMIT ? OFFSET ?
  `;
    runQuery(sql, [limit, offset]);
  }
};

// 전체 도서 조회
export const datailBook = (req, res) => {
  let { id } = req.params;

  const sql = `SELECT b.id, b.title, b.img, b.form, b.isbn, b.summary, b.detail, b.author, b.pages, b.contents, b.price, b.pub_date, c.name AS category
  FROM books b INNER JOIN category c ON b.category_id = c.id WHERE b.id = ?;
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
