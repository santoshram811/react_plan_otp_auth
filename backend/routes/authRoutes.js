const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const urlController = require("../controllers/urlController");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

router.get("/history", authMiddleware, urlController.getUrlHistory);

module.exports = router;
