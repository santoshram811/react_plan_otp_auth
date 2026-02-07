const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const subscriptionController = require("../controllers/subscriptionController");

router.post("/change", authMiddleware, subscriptionController.changePlan);

router.post("/activate-plan", authMiddleware, subscriptionController.activateUpcomingPlan);

module.exports = router;
