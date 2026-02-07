const axios = require("axios");

const otpStore = new Map();

exports.sendOtp = async (mobile) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 60 * 1000;

  otpStore.set(mobile, { otp, expiresAt });

  const payload = {
    api_key: process.env.SMS_API_KEY,
    msg: `Your OTP for mobile number authentication is ${otp}. Do not Share With Anyone. -${process.env.SENDER_ID}`,
    senderid: process.env.SENDER_ID,
    templateID: process.env.TEMPLATE_ID,
    coding: "1",
    to: mobile,
    callbackData: "cb",
  };

  try {
    const res = await axios.post(process.env.SMS_API_URL, payload, {
      headers: {
        Authorization: `Key ${process.env.SMS_API_KEY}`, //
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    console.log("SMS RESPONSE:", res.data);
  } catch (err) {
    console.error("SMS ERROR:", err.response?.data || err.message);
    throw new Error("OTP SMS failed");
  }

  //
  console.log("OTP (DEV):", otp);
};

exports.verifyOtp = (mobile, otp) => {
  const data = otpStore.get(mobile);
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }

  if (data.otp !== otp) return false;

  otpStore.delete(mobile);
  return true;
};


//for dummy otp


// services/otpService.js

// const DUMMY_OTP = "123456";

// exports.sendOtp = async (mobile) => {
//   console.log("📲 Dummy OTP sent to:", mobile);
//   console.log("🔐 OTP:", DUMMY_OTP);
//   return Promise.resolve(true);
// };

// exports.verifyOtp = (mobile, otp) => {
//   return otp === DUMMY_OTP;
// };
