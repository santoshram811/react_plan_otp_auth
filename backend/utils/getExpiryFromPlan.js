exports.getExpiryFromPlan = (planCode) => {
  const expiry = new Date();

  switch (planCode?.toLowerCase()) {
    case "free":
      expiry.setMinutes(expiry.getMinutes() + 5);
      break;

    case "hobby":
      expiry.setDate(expiry.getDate() + 1);
      break;

    case "pro":
      expiry.setDate(expiry.getDate() + 7);
      break;

    case "team":
      expiry.setDate(expiry.getDate() + 15);
      break;

    case "enterprise":
      expiry.setDate(expiry.getDate() + 30);
      break;

    default:
      expiry.setMinutes(expiry.getMinutes() + 5);
  }

  return expiry;
};
