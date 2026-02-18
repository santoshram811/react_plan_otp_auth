const db = require("../config/db");

exports.saveOtp = (userId, otp, expiresAt, cb) => {
  db.query(
    "INSERT INTO user_otp (user_id, otp, expires_at) VALUES (?, ?, ?)",
    [userId, otp, expiresAt],
    cb,
  );
};

exports.verifyOtp = (userId, otp, cb) => {
  db.query(
    `
    SELECT user_otp FROM user_otp
     WHERE user_id = ?
       AND otp = ?
       AND is_used = 0
       AND expires_at > NOW()
     ORDER BY id DESC
     LIMIT 1`,
    [userId, otp],
    cb,
  );
};

exports.markUsed = (id, cb) => {
  db.query("UPDATE user_otp SET is_used = 1 WHERE id = ?", [id], cb);
};

// maked for dummy otp model unmark for reaal
