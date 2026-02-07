import PlanCard from "./PlanCard";
import { plans } from "./plans";
import axiosInstance from "../../api/axios";
import { useState } from "react";

const PricingPage = () => {
  const [billing, setBilling] = useState("monthly");

  const handleSelectPlan = async (plan) => {
    try {
      await axiosInstance.post("/subscription/change", {
        planCode: plan.id,
        billingType: billing,
      });

      alert(`Plan changed to ${plan.name} (${billing})`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change plan");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-black mb-10">Choose Your Plan</h1>
      <div>
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-l-lg ${
              billing === "monthly" ? "bg-emerald-500 text-white" : "bg-gray-200"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBilling("yearly")}
            className={`px-6 py-2 rounded-r-lg ${
              billing === "yearly" ? "bg-emerald-500 text-white" : "bg-gray-200"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} billing={billing} />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
