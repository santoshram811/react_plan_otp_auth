const { db } = require("../config/db");

exports.getPlanIdByCode = (planCode, cb) => {
  const sql = `SELECT id FROM plans WHERE code = ? LIMIT 1`;
  db.query(sql, [planCode], (err, rows) => {
    if (err) return cb(err);
    cb(null, rows.length ? rows[0].id : null);
  });
};

exports.cancelUpcomingPlan = (userId, cb) => {
  const sql = `
    UPDATE user_subscriptions
    SET status = 'cancelled'
    WHERE user_id = ?
      AND status = 'upcoming'
  `;
  db.query(sql, [userId], cb);
};

exports.addUpcomingPlan = (userId, planId, cb) => {
  const sql = `
    INSERT INTO user_subscriptions (user_id, plan_id, status)
    VALUES (?, ?, 'upcoming')
  `;
  db.query(sql, [userId, planId], cb);
};

exports.expireActivePlan = (userId, cb) => {
  const sql = `
    UPDATE user_subscriptions
    SET status = 'expired',
        end_date = NOW()
    WHERE user_id = ?
      AND status = 'active'
  `;
  db.query(sql, [userId], cb);
};

exports.activateNewPlan = (userId, planId, billingType, cb) => {
  const duration = billingType === "yearly" ? 12 : 1;

  db.getConnection((err, conn) => {
    if (err) return cb(err);

    conn.beginTransaction((err) => {
      if (err) {
        conn.release();
        return cb(err);
      }

      //  Expire old active plan
      conn.query(
        `
        UPDATE user_subscriptions
        SET status='expired', end_date=NOW()
        WHERE user_id=? AND status='active'
        `,
        [userId],
        (err) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              cb(err);
            });
          }

          //  Insert new active plan
          conn.query(
            `
            INSERT INTO user_subscriptions
            (user_id, plan_id, status, start_date, end_date)
            VALUES (?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH))
            `,
            [userId, planId, duration],
            (err) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  cb(err);
                });
              }

              conn.commit((err) => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    cb(err);
                  });
                }

                conn.release();
                cb(null);
              });
            },
          );
        },
      );
    });
  });
};

exports.getPlanByCode = (code, cb) => {
  const sql = `
  SELECT id, monthly_price, yearly_price
  FROM plans WHERE code =?
  LIMIT 1
  `;
  db.query(sql, [code], (err, rows) => {
    if (err) return cb(err);
    cb(null, rows[0]);
  });
};

exports.getPlanWithPrice = (code, billingType, cb) => {
  const priceColumn = billingType === "yearly" ? "yearly_price" : "monthly_price";

  const sql = `
    SELECT id, ${priceColumn} AS price
    FROM plans
    WHERE code = ?
    LIMIT 1
  `;

  db.query(sql, [code], (err, rows) => {
    if (err) return cb(err);
    cb(null, rows.length ? rows[0] : null);
  });
};
