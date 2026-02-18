import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { FaEdit } from "react-icons/fa";
import UserUrlHistory from "./userUrlHistory/UserUrlHistory";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const [durationValue, setDurationValue] = useState(5);
  const [durationType, setDurationType] = useState("");

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]);

  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          axiosInstance.get("/profile"),
          axiosInstance.get("/history"),
        ]);

        setProfile(profileRes.data);
        setName(profileRes.data.name || "");
        setEmail(profileRes.data.email || "");
        setUrlHistory(historyRes.data);
      } catch (err) {
        if (err.response?.status === 401) handleLogout();
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl) {
      setMessage("Please enter a URL");
      return;
    }

    try {
      // const response = await axiosInstance.post("/shorten", {
      //   originalUrl,
      //   durationValue,
      //   durationType,
      // });

      const response = await axiosInstance.post("/shorten", {
        originalUrl,
      });

      setShortUrl(response.data.shortUrl);
      setCopied(false);

      const historyRes = await axiosInstance.get("/history");
      setUrlHistory(historyRes.data);

      const profileRes = await axiosInstance.get("/profile");
      setProfile(profileRes.data);

      setMessage(response.data.exists ? "URL already exists" : "New short URL created");
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
      else setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async () => {
    try {
      await axiosInstance.put("/profile", { name, email });
      setIsEmailEditable(false);
      setIsNameEditable(false);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update your details");
    }
  };

  const reactivateUrl = async (shortcodeId) => {
    try {
      await axiosInstance.post(`/reactivate/${shortcodeId}`);

      const historyRes = await axiosInstance.get("/history");
      setUrlHistory(historyRes.data);

      const profileRes = await axiosInstance.get("/profile");
      setProfile(profileRes.data);
    } catch {
      alert("You reached your plan limit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      {/* PROFILE DASHBOARD */}
      {profile && (
        <div className="max-w-6xl mx-auto mt-8 space-y-6">
          {/* Top Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">User Dashboard</h2>
                <p className="text-gray-500 text-sm">Mobile: {profile.mobile_number}</p>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                  Active Plan: {profile.plan_name}
                </span>

                {profile.plan_expiry && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    Expires on {new Date(profile.plan_expiry).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">Max URLs</p>
                <p className="text-xl font-bold">{profile.limits.max_urls}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">Used URLs</p>
                <p className="text-xl font-bold">{profile.used_urls}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">Remaining URLs</p>
                <p className="text-xl font-bold">{profile.remaining_urls}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">Total Clicks</p>
                <p className="text-xl font-bold">{profile.total_clicks_used}</p>
              </div>
            </div>
          </div>

          {/* Editable Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <div className="flex gap-3 mb-3">
              <input
                disabled={!isNameEditable}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-3 py-2 rounded w-full focus:ring focus:ring-blue-200"
                placeholder="Name"
              />
              <FaEdit
                onClick={() => setIsNameEditable(true)}
                className="cursor-pointer text-blue-600 mt-2"
              />
            </div>

            <div className="flex gap-3 mb-4">
              <input
                disabled={!isEmailEditable}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-3 py-2 rounded w-full focus:ring focus:ring-blue-200"
                placeholder="Email"
              />
              <FaEdit
                onClick={() => setIsEmailEditable(true)}
                className="cursor-pointer text-blue-600 mt-2"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              Save Profile
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setShowAnalytics(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              {showHistory ? "Hide History" : "View URL History"}
            </button>

            <button
              onClick={() => {
                setShowAnalytics(!showAnalytics);
                setShowHistory(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
            >
              {showAnalytics ? "Hide Analytics" : "URL Analytics"}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="border w-full p-2 rounded mb-4"
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">Shorten URL</button>
        </form>

        {message && <p className="mt-2">{message}</p>}

        {shortUrl && (
          <div className="mt-4">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {shortUrl}
            </a>

            <button onClick={handleCopy} className="ml-4 bg-gray-200 px-2 py-1 rounded">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
      {/* HISTORY SECTION */}
      {showHistory && (
        <div className="max-w-6xl mx-auto mt-6 bg-white rounded-2xl shadow-md p-6">
          <UserUrlHistory history={urlHistory} reactivateUrl={reactivateUrl} />
        </div>
      )}

      {/* ANALYTICS SECTION */}
      {showAnalytics && profile && (
        <div className="max-w-6xl mx-auto mt-6 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Analytics Overview</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Plan Max URLs</p>
              <p className="text-xl font-bold">{profile.limits.max_urls}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Total URLs</p>
              <p className="text-xl font-bold">{profile.generated_short_urls}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Total Clicks</p>
              <p className="text-xl font-bold">{profile.total_clicks_used}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Remaining Clicks</p>
              <p className="text-xl font-bold">{profile.remaining_clicks}</p>
            </div>
          </div>
        </div>
      )}

      {/* SHORTEN FORM */}
    </div>
  );
};

export default UrlShortener;
