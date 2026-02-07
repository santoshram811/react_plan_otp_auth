const Url = require("../models/urlModel");
const { db } = require("../config/db");
const User = require("../models/userModel");

exports.shortenUrl = (req, res) => {
  const { originalUrl, durationValue, durationType } = req.body;
  const userId = req.user.id;

  User.getActivePlanLimits(userId, (err, limits) => {
    if (err) {
      return res.status(500).json({ message: "Failed to read plan limits" });
    }

    Url.countUserUrls(userId, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Failed to count URLs" });
      }

      const used = rows[0].total;

      if (limits.max_urls !== "unlimited" && used >= limits.max_urls) {
        return res.status(403).json({
          message: "URL limit reached. Please upgrade your plan",
        });
      }

      if (!originalUrl || typeof originalUrl !== "string") {
        return res.status(400).json({ message: "URL is required" });
      }

      const cleanUrl = originalUrl.trim();
      const value = parseInt(durationValue) || 10;
      const type = durationType || "minutes";

      Url.findByOriginalUrl(userId, cleanUrl, (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length > 0) {
          return res.json({
            exists: true,
            shortUrl: `http://localhost:3000/turain/${rows[0].short_code}`,
          });
        }

        let expiryDate = new Date();
        if (type === "minutes") expiryDate.setMinutes(expiryDate.getMinutes() + value);
        else if (type === "hours") expiryDate.setHours(expiryDate.getHours() + value);
        else expiryDate.setDate(expiryDate.getDate() + value);

        db.getConnection((err, conn) => {
          if (err) return res.status(500).json(err);

          conn.beginTransaction((err) => {
            if (err) {
              conn.release();
              return res.status(500).json(err);
            }

            Url.getExpiredshortcode(conn, (err, rows) => {
              if (err || rows.length === 0) {
                return conn.rollback(() => {
                  conn.release();
                  res.status(503).json({ message: "No short codes available" });
                });
              }

              const { id: shortcodeId, short_code } = rows[0];

              Url.reactivateshortcode(conn, shortcodeId, expiryDate, (err) => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    res.status(500).json(err);
                  });
                }

                Url.insertUrl(conn, userId, cleanUrl, shortcodeId, (err) => {
                  if (err) {
                    return conn.rollback(() => {
                      conn.release();
                      res.status(500).json(err);
                    });
                  }

                  conn.commit((err) => {
                    if (err) {
                      return conn.rollback(() => {
                        conn.release();
                        res.status(500).json(err);
                      });
                    }

                    conn.release();
                    res.json({
                      exists: false,
                      shortUrl: `http://localhost:3000/turain/${short_code}`,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.redirectUrl = (req, res) => {
  const { shortcode } = req.params;

  Url.findByShortcodeForRedirect(shortcode, (err, rows) => {
    if (err || !rows.length) {
      return res.status(404).send("URL expired or not found");
    }

    const { original_url, user_id, shortcode_id } = rows[0];

    User.getActivePlanLimits(user_id, (err, limits) => {
      if (err) return res.status(500).send("Plan error");

      User.getUserClickUsage(user_id, (err, usedClicks) => {
        if (err) return res.status(500).send("Usage error");

        if (limits.tracked_clicks !== "unlimited" && usedClicks >= limits.tracked_clicks) {
          return res.status(403).send("Click limit exceeded. Please upgrade your plan.");
        }

        res.redirect(original_url);

        Url.incrementShortcodeClick(shortcode_id).catch(() => {});
        Url.incrementUserClick(user_id).catch(() => {});
      });
    });
  });
};

exports.getUrlHistory = (req, res) => {
  const userId = req.user.id;

  User.getUserUrlHistory(userId, (err, rows) => {
    if (err) return res.status(500).json({ message: "failde to fetch the history" });
    res.json(rows);
  });
};

exports.reactivateUrl = (req, res) => {
  const userId = req.user.id;
  const shortcodeId = req.params.shortcodeId;

  // Step 1: check plan limits
  User.getUsageAndLimits(userId, (err, usage) => {
    if (err) return res.status(500).json(err);

    const max = usage.limits.max_urls;
    const used = usage.used_urls;

    if (max !== "unlimited" && used >= max) {
      return res.status(403).json({
        message: "You reached your plan limit",
      });
    }

    // Step 2: reactivate shortcode (extend expiry)
    db.query(
      `
      UPDATE shortcode
      SET expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
      WHERE id = ?
      `,
      [shortcodeId],
      (err) => {
        if (err) return res.status(500).json(err);

        console.log("URL reactivated:", shortcodeId);

        res.json({ message: "Reactivated successfully" });
      },
    );
  });
};
