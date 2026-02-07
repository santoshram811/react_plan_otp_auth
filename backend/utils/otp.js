exports.generateOTP = () => {
  return Math.floor(100000 + Math.randon() * 900000).toString();
};
