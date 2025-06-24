import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

export const order = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  const conn = await connection.getConnection(); // 트랜잭션 처리를 위한 커넥션 따로 받기
  await conn.beginTransaction();

  try {
    // 1. 배송 정보 등록
    const [deliveryResult] = await conn.query(
      "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)",
      [delivery.address, delivery.receiver, delivery.contact]
    );
    const delivery_id = deliveryResult.insertId;

    // 2. 주문 테이블 등록
    const [ordersResult] = await conn.query(
      "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)",
      [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id]
    );
    const orders_id = ordersResult.insertId;

    // 3. 주문 도서 목록 등록
    const orderedBookValues = items.map((item) => [
      orders_id,
      item.book_id,
      item.quantity,
    ]);
    await conn.query(
      "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?",
      [orderedBookValues]
    );

    // 4. 장바구니에서 해당 항목 삭제
    const bookIds = items.map((item) => item.book_id);
    await conn.query(
      "DELETE FROM cartItems WHERE user_id = ? AND book_id IN (?)",
      [userId, bookIds]
    );

    // 모두 성공 시 커밋
    await conn.commit();

    return res.status(StatusCodes.CREATED).json({
      message: "주문이 성공적으로 처리되었습니다.",
      delivery_id,
      orders_id,
    });
  } catch (err) {
    await conn.rollback(); // 실패 시 롤백
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "주문 처리 중 에러 발생", err });
  } finally {
    conn.release(); // 커넥션 반환
  }
};

// 주문 목록 조회
export const getOrders = async (req, res) => {
  try {
    const getOrderSql = `
      SELECT 
        orders.id, 
        orders.book_title, 
        orders.total_quantity, 
        orders.total_price, 
        orders.created_at, 
        delivery.address, 
        delivery.receiver, 
        delivery.contact 
      FROM orders 
      LEFT JOIN delivery ON orders.delivery_id = delivery.id
    `;

    const [rows] = await connection.query(getOrderSql);

    return res.status(StatusCodes.OK).json(rows);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "❌ 주문 목록 조회 중 에러 발생",
      err,
    });
  }
};

// 주문 상세 상품 조회
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const getOrderDetailSql = `
      SELECT 
        book_id, 
        book_title, 
        author, 
        price, 
        quantity
      FROM orderedBook 
      LEFT JOIN books ON orderedBook.book_id = books.id
      WHERE order_id = ? 
    `;

    const [rows] = await connection.query(getOrderDetailSql, [id]);

    return res.status(StatusCodes.OK).json(rows);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "❌ 주문 상세 조회 중 에러 발생",
      err,
    });
  }
};
