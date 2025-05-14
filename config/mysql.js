import mariaDb from "mysql2";
import dotenv from "dotenv";
dotenv.config();

//DB와 연결 통로 생성
const connection = mariaDb.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  dateStrings: true,
});

export default connection;
