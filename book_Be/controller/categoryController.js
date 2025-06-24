import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";

export const allCategory = (req, res) => {
  let sql = "SELECT * FROM category";
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "err발생", err });
    }
    return res.status(StatusCodes.OK).json(result);
  });
};
