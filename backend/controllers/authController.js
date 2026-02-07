// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const otpService = require("../services/otpService");

// exports.sendOtp = async (req, res) => {
//   const { mobile } = req.body;

//   if (!/^[6-9]\d{9}$/.test(mobile)) {
//     return res.status(400).json({ message: "Invalid mobile number" });
//   }

//   try {
//     await otpService.sendOtp(mobile);
//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "OTP failed" });
//   }
// };

// exports.verifyOtp = (req, res) => {
//   const { mobile, otp } = req.body;

//   if (!otpService.verifyOtp(mobile, otp)) {
//     return res.status(401).json({ message: "Invalid or expired OTP" });
//   }

//   User.findByMobile(mobile, (err, users) => {
//     if (err) return res.status(500).json(err);

//     const login = (user) => {
//       const token = jwt.sign({ id: user.id, mobile }, process.env.JWT_SECRET, { expiresIn: "6h" });

//       User.updateToken(user.id, token, () => {
//         res.json({ token, user });
//       });
//     };

//     if (users.length) {
//       login(users[0]);
//     } else {
//       User.createUser(mobile, async (err, result) => {
//         const userId = result.insertId;

//         // 🔹 assign FREE plan by default
//         const { dbPromise } = require("../config/db");

//         const [[freePlan]] = await dbPromise.query("SELECT id FROM plans WHERE code = 'free'");

//         await dbPromise.query(
//           "INSERT INTO user_subscriptions (user_id, plan_id, status) VALUES (?, ?, 'active')",
//           [userId, freePlan.id],
//         );

//         login({ id: userId, mobile_number: mobile });
//       });
//     }
//   });
// };

// exports.getProfile = (req, res) => {
//   const userId = req.user.id;

//   User.findProfileWithActivePlan(userId, (err, profile) => {
//     if (err) return res.status(500).json(err);
//     if (!profile) return res.status(404).json({ message: "User not found" });

//     User.getUsageAndLimits(userId, (err, data) => {
//       if (err) return res.status(500).json(err);

//       profile.limits = data.limits;
//       profile.used_urls = data.used_urls;

//       profile.remaining_urls =
//         data.limits.max_urls === "unlimited"
//           ? "unlimited"
//           : Math.max(data.limits.max_urls - data.used_urls, 0);

//       User.getGeneratedShortcodeCount(userId, (err, totalUrls) => {
//         if (err) return res.status(500).json(err);

//         profile.generated_short_urls = totalUrls;

//         User.getUserClickUsage(userId, (err, totalClicks) => {
//           if (err) return res.status(500).json(err);

//           profile.total_clicks_used = totalClicks;
//           profile.allowed_clicks = profile.limits.tracked_clicks;
//           profile.remaining_clicks =
//             profile.limits.tracked_clicks === "unlimited"
//               ? "unlimited"
//               : Math.max(profile.limits.tracked_clicks - totalClicks, 0);

//           User.getPlansForProfile(userId, (err, plans) => {
//             if (err) return res.status(500).json(err);

//             profile.currentPlan = plans.activePlan;
//             profile.upcomingPlan = plans.upcomingPlan;

//             res.json(profile);
//           });
//         });
//       });
//     });
//   });
// };

// exports.updateProfile = (req, res) => {
//   const userId = req.user.id;
//   let { name, email } = req.body;

//   name = name ? String(name).trim() : null;
//   email = email ? String(email).trim() : null;

//   User.updateProfile(userId, name, email, (err) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Profile updated successfully" });
//   });
// };

// exports.activateUpcomingPlan = (req, res) => {
//   const userId = req.user.id;

//   //  Expire current active plan
//   db.query(
//     "UPDATE user_subscriptions SET status='expired' WHERE user_id=? AND status='active'",
//     [userId],
//     (err) => {
//       if (err) return res.status(500).json(err);

//       //  Activate upcoming plan
//       db.query(
//         "UPDATE user_subscriptions SET status='active' WHERE user_id=? AND status='upcoming'",
//         [userId],
//         (err) => {
//           if (err) return res.status(500).json(err);

//           res.json({ message: "Plan activated successfully" });
//         },
//       );
//     },
//   );
// };

// dummy oto bellow

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const otpService = require("../services/otpService");
const { db } = require("../config/db");

/* SEND OTP */
// exports.sendOtp = async (req, res) => {
//   const { mobile } = req.body;

//   if (!/^[6-9]\d{9}$/.test(mobile)) {
//     return res.status(400).json({ message: "Invalid mobile number" });
//   }

//   try {
//     await otpService.sendOtp(mobile);
//     res.json({ message: "OTP sent successfully (dummy)" });
//   } catch (err) {
//     res.status(500).json({ message: "OTP failed" });
//   }
// };

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ message: "Invalid mobile number" });
  }

  try {
    await otpService.sendOtp(mobile);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP failed" });
  }
};

/* VERIFY OTP */
// exports.verifyOtp = (req, res) => {
//   const { mobile, otp } = req.body;

//   if (!otpService.verifyOtp(mobile, otp)) {
//     return res.status(401).json({ message: "Invalid OTP" });
//   }

//   User.findByMobile(mobile, async (err, users) => {
//     if (err) return res.status(500).json(err);

//     const login = (user) => {
//       const token = jwt.sign({ id: user.id, mobile }, process.env.JWT_SECRET, { expiresIn: "6h" });

//       User.updateToken(user.id, token, () => {
//         res.json({ token, user });
//       });
//     };

//     if (users.length) {
//       login(users[0]);
//     } else {
//       User.createUser(mobile, async (err, result) => {
//         if (err) return res.status(500).json(err);

//         const userId = result.insertId;
//         const { dbPromise } = require("../config/db");

//         // Assign FREE plan
//         const [[freePlan]] = await dbPromise.query("SELECT id FROM plans WHERE code='free'");

//         await dbPromise.query(
//           "INSERT INTO user_subscriptions (user_id, plan_id, status) VALUES (?, ?, 'active')",
//           [userId, freePlan.id],
//         );

//         login({ id: userId, mobile_number: mobile });
//       });
//     }
//   });
// };
exports.verifyOtp = (req, res) => {
  const { mobile, otp } = req.body;

  if (!otpService.verifyOtp(mobile, otp)) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  User.findByMobile(mobile, (err, users) => {
    if (err) return res.status(500).json(err);

    const login = (user) => {
      const token = jwt.sign({ id: user.id, mobile }, process.env.JWT_SECRET, { expiresIn: "6h" });

      User.updateToken(user.id, token, () => {
        res.json({ token, user });
      });
    };

    if (users.length) {
      login(users[0]);
    } else {
      User.createUser(mobile, async (err, result) => {
        const userId = result.insertId;

        // 🔹 assign FREE plan by default
        const { dbPromise } = require("../config/db");

        const [[freePlan]] = await dbPromise.query("SELECT id FROM plans WHERE code = 'free'");

        await dbPromise.query(
          "INSERT INTO user_subscriptions (user_id, plan_id, status) VALUES (?, ?, 'active')",
          [userId, freePlan.id],
        );

        login({ id: userId, mobile_number: mobile });
      });
    }
  });
};
/* GET PROFILE */

exports.getProfile = (req, res) => {
  try {
    // console.log("PROFILE REQUEST START");

    if (!req.user || !req.user.id) {
      console.log("No user in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user.id;
    // console.log("User ID:", userId);

    User.findProfileWithActivePlan(userId, (err, profile) => {
      if (err) {
        console.error("STEP 1 ERROR:", err);
        return res.status(500).json(err);
      }

      // console.log("Profile found:", profile);

      if (!profile) return res.status(404).json({ message: "User not found" });

      User.getUsageAndLimits(userId, (err, data) => {
        if (err) {
          console.error("STEP 2 ERROR:", err);
          return res.status(500).json(err);
        }

        // console.log("Usage data:", data);

        profile.limits = data.limits;
        profile.used_urls = data.used_urls;

        profile.remaining_urls =
          data.limits.max_urls === "unlimited"
            ? "unlimited"
            : Math.max(data.limits.max_urls - data.used_urls, 0);

        User.getGeneratedShortcodeCount(userId, (err, totalUrls) => {
          if (err) {
            console.error("STEP 3 ERROR:", err);
            return res.status(500).json(err);
          }

          // console.log("Shortcodes:", totalUrls);

          profile.generated_short_urls = totalUrls;

          User.getUserClickUsage(userId, (err, totalClicks) => {
            if (err) {
              console.error("STEP 4 ERROR:", err);
              return res.status(500).json(err);
            }

            // console.log("Clicks:", totalClicks);

            profile.total_clicks_used = totalClicks;
            profile.allowed_clicks = profile.limits.tracked_clicks;
            profile.remaining_clicks =
              profile.limits.tracked_clicks === "unlimited"
                ? "unlimited"
                : Math.max(profile.limits.tracked_clicks - totalClicks, 0);

            User.getPlansForProfile(userId, (err, plans) => {
              if (err) {
                console.error("STEP 5 ERROR:", err);
                return res.status(500).json(err);
              }

              // console.log("Plans:", plans);

              profile.currentPlan = plans.activePlan;
              profile.upcomingPlan = plans.upcomingPlan;

              // console.log("PROFILE SUCCESS");
              res.json(profile);
            });
          });
        });
      });
    });
  } catch (e) {
    console.error("FATAL CRASH:", e);
    res.status(500).json({ message: "Fatal crash" });
  }
};

/* UPDATE PROFILE */
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  let { name, email } = req.body;

  name = name ? String(name).trim() : null;
  email = email ? String(email).trim() : null;

  User.updateProfile(userId, name, email, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Profile updated successfully" });
  });
};

/* ACTIVATE UPCOMING PLAN */
exports.activateUpcomingPlan = (req, res) => {
  const userId = req.user.id;

  db.query(
    "UPDATE user_subscriptions SET status='expired' WHERE user_id=? AND status='active'",
    [userId],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "UPDATE user_subscriptions SET status='active' WHERE user_id=? AND status='upcoming'",
        [userId],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Plan activated successfully" });
        },
      );
    },
  );
};
