import connection from "../config/mysql.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const joinUser = (req, res) => {
  const { email, password } = req.body;
  console.log(`요청 바디:, ${req.body}`);

  //password 암호화 해서 salt 값과 db에 저장하기
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPwd = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let sql = "INSERT INTO users(email, password, salt) VALUES (?, ?, ?)";
  let values = [email, hashPwd, salt];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "err발생", err });
    }
    console.log(`salt 값 출력 ${salt}`);
    return res.status(StatusCodes.CREATED).json({ results });
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  let sql = "SELECT * FROM users WHERE email =?";
  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "err발생", err });
    }

    const loginUser = results[0];

    // salt값 꺼내서 날 것으로 들어온 비밀번호 암호화 해보고
    const hashpwd = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    // DB에 저장되어 있는 것 비교
    if (loginUser && loginUser.password === hashpwd) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "songa",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      console.log(`reqEmail확인: ${req.body.email}`);
      console.log(`token확인: ${token}`);

      return res.status(StatusCodes.OK).json(results);
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "비밀번호 혹은 이메일이 존재하지 않습니다." });
    }
  });
};

export const passwordResetRequset = (req, res) => {
  const { email } = req.body;

  let sql = "SELECT * FROM users WHERE email =?";
  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "err발생", err });
    }
    // 이메일로 유저가 있는지 찾아봄
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "요청하신 이메일이 없습니다." });
    }
  });
};

export const passwordRest = (req, res) => {
  const { email, password } = req.body;

  // 암호화된 비밀번호를 같이 DB에 저장
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPwd = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let sql = "UPDATE users SET password =?, salt=? WHERE email = ?";
  let values = [hashPwd, salt, email];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "err발생", err });
    }
    if (results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "이메일이 잘 못 된거같은데요 ?",
      });
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
};
