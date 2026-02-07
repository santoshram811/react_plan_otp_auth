import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const navigate = useNavigate();

  /* SEND / RESEND OTP */
  const handleSendOtp = async () => {
    if (!mobile) {
      setMessage("Enter mobile number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axiosInstance.post("/send-otp", { mobile });

      setOtpSent(true);
      setOtpTimer(60); //  60 sec timer
      setMessage("OTP sent successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/verify-otp", {
        mobile,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashbaord");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* COUNTDOWN TIMER */
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  const formatTime = (sec) => {
    return `00:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div
      className="m-70"
      style={{
        padding: "30px",
        maxWidth: "320px",
        margin: "aut",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ textAlign: "center" }}>OTP Login</h3>

      <input
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        maxLength={10}
        disabled={otpSent}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");

          // allow only first digit 6–9
          if (value.length === 1 && !/[6-9]/.test(value)) {
            return;
          }

          setMobile(value.slice(0, 10));
        }}
        className="bg-gray-200"
        style={{ width: "100%", padding: "8px", marginTop: "10px" }}
      />

      <button
        onClick={handleSendOtp}
        disabled={loading || otpTimer > 0}
        style={{ width: "100%", marginTop: "12px" }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        {loading
          ? "Sending..."
          : otpTimer > 0
            ? `Resend OTP in ${formatTime(otpTimer)}`
            : otpSent
              ? "Resend OTP"
              : "Send OTP"}
      </button>

      {/* OTP INPUT + VERIFY */}
      {otpSent && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-gray-200"
            style={{ width: "100%", padding: "8px", marginTop: "12px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "12px" }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      )}

      {message && (
        <p style={{ marginTop: "10px", color: "gray", textAlign: "center" }}>{message}</p>
      )}
      <div></div>
    </div>
  );
};

export default Login;
