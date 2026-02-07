const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const authMiddleware = require("../middleware/auth");

router.post("/shorten", authMiddleware, urlController.shortenUrl);

router.get("/history", authMiddleware, urlController.getUrlHistory);

router.post("/reactivate/:shortcodeId", authMiddleware, urlController.reactivateUrl);
router.get("/:shortcode", urlController.redirectUrl);

module.exports = router;
