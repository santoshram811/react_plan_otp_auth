const { db } = require("../config/db");

exports.findByOriginalUrl = (userId, originalUrl, cb) => {
  const sql = `
    SELECT s.short_code
    FROM urls u
    JOIN shortcode s ON u.short_code_id = s.id
    WHERE u.user_id = ?
      AND u.original_url = ?
      AND s.expires_at > NOW()
    LIMIT 1
  `;
  db.query(sql, [userId, originalUrl], cb);
};

exports.findByshortcode = (shortcode, cb) => {
  const sql = `
    SELECT u.original_url
    FROM urls u
    JOIN shortcode s ON u.short_code_id = s.id
    WHERE s.short_code = ?
      AND s.expires_at > NOW()
    LIMIT 1
  `;
  db.query(sql, [shortcode], cb);
};

exports.getExpiredshortcode = (conn, cb) => {
  const sql = `
    SELECT id, short_code
    FROM shortcode
    WHERE expires_at <= NOW()
    ORDER BY expires_at
    LIMIT 1
    FOR UPDATE
  `;
  conn.query(sql, cb);
};

exports.reactivateshortcode = (conn, shortcodeId, expiryDate, cb) => {
  const sql = `
    UPDATE shortcode
    SET expires_at = ?
    WHERE id = ?
  `;
  conn.query(sql, [expiryDate, shortcodeId], cb);
};

exports.insertUrl = (conn, userId, originalUrl, shortcodeId, cb) => {
  const sql = `
    INSERT INTO urls (user_id, original_url, short_code_id)
    VALUES (?, ?, ?)
  `;
  conn.query(sql, [userId, originalUrl, shortcodeId], cb);
};

exports.countUserUrls = (userId, cb) => {
  const sql = `
    SELECT COUNT(*) AS total
    FROM urls
    WHERE user_id = ?
  `;
  db.query(sql, [userId], cb);
};

exports.findByShortcodeForRedirect = (shortcode, cb) => {
  const sql = `
    SELECT
      u.original_url,
      u.user_id,
      s.id AS shortcode_id



      
    FROM urls u
    JOIN shortcode s ON s.id = u.short_code_id
    WHERE s.short_code = ?
      AND s.expires_at > NOW()
    LIMIT 1
  `;
  db.query(sql, [shortcode], cb);
};
exports.incrementShortcodeClick = (shortcodeId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE shortcode SET click_count = click_count + 1 WHERE id = ?",
      [shortcodeId],
      (err) => (err ? reject(err) : resolve()),
    );
  });
};

exports.incrementUserClick = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      INSERT INTO user_click_stats (user_id, total_clicks)
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE total_clicks = total_clicks + 1
      `,
      [userId],
      (err) => (err ? reject(err) : resolve()),
    );
  });
};

exports.reactivateExpiredUrl = (shortcodeId, newExpiry, cb) => {
  const sql = `
    UPDATE shortcode
    SET expires_at = ?
    WHERE id = ?
      AND expires_at <= NOW()
  `;
  db.query(sql, [newExpiry, shortcodeId], cb);
};

exports.reactivateUrl = (shortcodeId, cb) => {
  const sql = `
    UPDATE shortcode
    SET expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
    WHERE id = ?
      AND expires_at <= NOW()
  `;
  db.query(sql, [shortcodeId], cb);
};
