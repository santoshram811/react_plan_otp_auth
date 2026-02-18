const { db } = require("../config/db");

exports.findByMobile = (mobile, cb) => {
  const sql = `
    SELECT id, mobile_number, name, email
    FROM users
    WHERE mobile_number = ?
    LIMIT 1
  `;
  db.query(sql, [mobile], cb);
};

exports.createUser = (mobile, cb) => {
  const sql = `
    INSERT INTO users (mobile_number)
    VALUES (?)
  `;
  db.query(sql, [mobile], cb);
};

exports.updateToken = (userId, token, cb) => {
  const sql = `
    UPDATE users
    SET token = ?
    WHERE id = ?
  `;
  db.query(sql, [token, userId], cb);
};

exports.findById = (userId, cb) => {
  const sql = `
    SELECT id, mobile_number, name, email
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  db.query(sql, [userId], cb);
};

exports.updateProfile = (userId, name, email, cb) => {
  const sql = `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
  `;
  db.query(sql, [name, email, userId], cb);
};

exports.findProfileWithActivePlan = (userId, cb) => {
  const sql = `
     SELECT
        u.id,
        u.mobile_number,
        u.name,
        u.email,

        p.id AS plan_id,
        p.name AS plan_name,
        p.code AS plan_code,
        p.description,
        p.limits,
        p.monthly_price,
        p.yearly_price,

        us.end_date AS plan_expiry

      FROM users u
      
      LEFT JOIN user_subscriptions us
        ON us.id = (
            SELECT us2.id
            FROM user_subscriptions us2
            WHERE us2.user_id = u.id
              AND us2.status = 'active'
            ORDER BY us2.start_date DESC
            LIMIT 1
        )

      LEFT JOIN plans p
        ON p.id = us.plan_id 

      WHERE u.id = ?
      LIMIT 1
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return cb(err);

    if (!results.length) return cb(null, null);

    const row = results[0];

    let limits = { max_urls: 5, tracked_clicks: 2 };

    if (row.limits) {
      try {
        limits = typeof row.limits === "string" ? JSON.parse(row.limits) : row.limits;
      } catch (e) {
        console.error("Invalid limits JSON:", row.limits);
      }
    }

    cb(null, {
      id: row.id,
      mobile_number: row.mobile_number,
      name: row.name,
      email: row.email,

      plan_id: row.plan_id,
      plan_name: row.plan_name,
      plan_code: row.plan_code,
      description: row.description,
      limits,
      monthly_price: row.monthly_price,
      yearly_price: row.yearly_price,

      // ✅ this is what your React needs
      plan_expiry: row.plan_expiry,
    });
  });
};

exports.getActivePlanLimits = (userId, cb) => {
  const sql = `
    SELECT p.limits
    FROM user_subscriptions us
    JOIN plans p ON p.id = us.plan_id
    WHERE us.user_id = ?
      AND us.status = 'active'
    LIMIT 1
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return cb(err);

    // fallback: FREE plan
    if (!rows.length) {
      return cb(null, { max_urls: 5, tracked_clicks: 2 });
    }

    let limits;
    try {
      limits = JSON.parse(rows[0].limits);
    } catch {
      limits = { max_urls: 5, tracked_clicks: 2 };
    }

    cb(null, limits);
  });
};

exports.getUsageAndLimits = (userId, cb) => {
  const sql = `
    SELECT 
      p.limits,

      COUNT(
        CASE 
          WHEN s.expires_at > NOW() 
          THEN u.id 
        END
      ) AS used_urls

    FROM user_subscriptions us
    JOIN plans p ON p.id = us.plan_id

    LEFT JOIN urls u 
      ON u.user_id = us.user_id

    LEFT JOIN shortcode s
      ON s.id = u.short_code_id

    WHERE us.user_id = ?
      AND us.status = 'active'

    GROUP BY p.limits
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return cb(err);

    if (!rows.length) {
      return cb(null, {
        limits: { max_urls: 5, tracked_clicks: 2 },
        used_urls: 0,
      });
    }

    let limits = { max_urls: 5, tracked_clicks: 2 };

    try {
      if (rows[0].limits) {
        limits = typeof rows[0].limits === "string" ? JSON.parse(rows[0].limits) : rows[0].limits;
      }
    } catch (e) {
      console.error("Limits JSON error:", rows[0].limits);
    }

    cb(null, {
      limits,
      used_urls: Number(rows[0].used_urls) || 0,
    });
  });
};

exports.getGeneratedShortcodeCount = (userId, cb) => {
  const sql = `
    SELECT COUNT(*) AS total
    FROM urls
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return cb(err);

    const total = rows && rows[0] ? rows[0].total : 0;

    cb(null, total);
  });
};

exports.getPlansForProfile = (userId, cb) => {
  const sql = `
    SELECT
      us.status,
      p.name,
      p.code,
      p.limits
    FROM user_subscriptions us
    JOIN plans p ON p.id = us.plan_id
    WHERE us.user_id = ?
      AND us.status IN ('active', 'upcoming')
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return cb(err);

    let activePlan = null;
    let upcomingPlan = null;

    rows.forEach((row) => {
      let limits = {};

      try {
        limits = row.limits ? JSON.parse(row.limits) : {};
      } catch (e) {
        console.error("Invalid limits JSON:", row.limits);
      }

      const plan = {
        name: row.name,
        code: row.code,
        limits,
      };

      if (row.status === "active") activePlan = plan;
      if (row.status === "upcoming") upcomingPlan = plan;
    });

    cb(null, { activePlan, upcomingPlan });
  });
};

exports.getUserClickUsage = (userId, cb) => {
  const sql = `
    SELECT total_clicks
    FROM user_click_stats
    WHERE user_id = ?
    LIMIT 1
  `;
  db.query(sql, [userId], (err, rows) => {
    if (err) return cb(err);
    cb(null, rows.length ? rows[0].total_clicks : 0);
  });
};

exports.getUserUrlHistory = (userId, cb) => {
  const sql = `
    SELECT
    

  s.id AS shortcode_id,
  u.original_url,
  s.short_code,






      s.click_count AS clicks,
      u.created_at,
      s.expires_at,
      IF(s.expires_at > NOW(), 'active', 'expired') AS status,
      p.name AS plan_name

    FROM urls u
    INNER JOIN shortcode s ON s.id = u.short_code_id

    LEFT JOIN user_subscriptions us
      ON us.id = (
        SELECT us2.id
        FROM user_subscriptions us2
        WHERE us2.user_id = u.user_id
          AND us2.start_date <= u.created_at
          AND (us2.end_date IS NULL OR us2.end_date >= u.created_at)
        ORDER BY us2.start_date DESC
        LIMIT 1
      )

    LEFT JOIN plans p ON p.id = us.plan_id

    WHERE u.user_id = ?
    ORDER BY u.created_at DESC
  `;

  db.query(sql, [userId], cb);
};
