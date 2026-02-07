const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool;

const dbPromise = pool.promise();

pool.getConnection((err, conn) => {
  if (err) {
    console.error("DB Error:", err);
  } else {
    console.log("MySQL connected successfully");
    conn.release();
  }
});

module.exports = {
  db,
  dbPromise,
};
