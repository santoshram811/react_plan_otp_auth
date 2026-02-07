const PlanCard = ({ plan, onSelect, billing }) => {
  const price = billing === "yearly" ? plan.yearly_price : plan.monthly_price;

  const period = billing === "yearly" ? "year" : "month";
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm bg-white text-black
      ${plan.highlighted ? "border-emerald-400 scale-105" : "border-slate-700"}`}
    >
      {plan.highlighted && (
        <span className="inline-block mb-2 px-3 py-1 text-xs bg-emerald-500 text-black rounded-full">
          BEST OFFER
        </span>
      )}

      <h3 className="text-xl font-semibold">{plan.name}</h3>
      <p className="text-sm text-slate-400">{plan.description}</p>

      <div className="my-4">
        <span className="text-3xl font-bold">₹{price}</span>
        <span className="text-slate-400"> / {period}</span>

        {billing === "yearly" && (
          <p className="text-xs text-emerald-500 mt-1">Save more with yearly billing 20 %</p>
        )}
      </div>

      <ul className="space-y-2 text-sm mb-6">
        {plan.features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-emerald-400">✔</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-2 rounded-lg font-semibold
        ${plan.highlighted ? "bg-emerald-500 text-white" : "bg-slate-200 hover:bg-slate-400"}`}
      >
        {price === 0 ? "Sign Up Free" : "Buy"}
      </button>
    </div>
  );
};

export default PlanCard;
