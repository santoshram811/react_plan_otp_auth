const Subscription = require("../models/subscriptionModel");
const { db } = require("../config/db");

exports.changePlan = (req, res) => {
  const userId = req.user.id;
  const { planCode, billingType } = req.body;

  if (!planCode || !billingType) {
    return res.status(400).json({ message: "Missing plan info" });
  }

  Subscription.getPlanWithPrice(planCode, billingType, (err, plan) => {
    if (err) return res.status(500).json(err);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    Subscription.activateNewPlan(userId, plan.id, billingType, (err) => {
      if (err) return res.status(500).json(err);

      Subscription.deactivateFreePlanUrls(userId, (err) => {
        if (err) console.log("Failed to deactivate free plan URLs", err);
      });

      res.json({
        message: "Plan activated",
        price: plan.price,
        billing: billingType,
      });
    });
  });
};

exports.activateUpcomingPlan = (req, res) => {
  const userId = req.user.id;

  //  Expire current active plan
  Subscription.expireActivePlan(userId, (err) => {
    if (err) return res.status(500).json(err);

    //  Activate upcoming plan
    Subscription.activateUpcomingPlan(userId, (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Plan activated successfully" });
    });
  });
};
