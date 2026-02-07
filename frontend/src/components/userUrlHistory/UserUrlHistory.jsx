import React, { useState } from "react";
import axiosInstance from "../../api/axios";

const ITEMS_PER_PAGE = 10;

const UserUrlHistory = ({ history, reactivateUrl }) => {
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState(null);

  if (!history || history.length === 0) {
    return <p className="text-gray-500 mt-6">No URLs created yet.</p>;
  }

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = history.slice(start, start + ITEMS_PER_PAGE);

  const openOriginalUrl = (url) => {
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(finalUrl, "_blank");
  };

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">User URL History</h2>

      {/* Cards */}
      <div className="space-y-4">
        {currentItems.map((item, index) => {
          const formattedCode = String(item.short_code).padStart(3, "0");
          const fullShortUrl = `${import.meta.env.VITE_BACKEND_URL}/${formattedCode}`;

          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Top summary row */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div>
                  <p
                    className="text-blue-600 font-semibold underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(fullShortUrl, "_blank");
                    }}
                  >
                    {fullShortUrl}
                  </p>
                  <p className="text-sm text-gray-500">{item.clicks ?? 0} clicks</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="text-gray-400 text-xl">{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Dropdown details */}
              {isOpen && (
                <div className="border-t px-4 py-4 text-sm bg-gray-50 space-y-3">
                  <div>
                    <strong>Original URL:</strong>{" "}
                    <span
                      onClick={() => openOriginalUrl(item.original_url)}
                      className="text-blue-600 underline cursor-pointer break-all"
                    >
                      {item.original_url}
                    </span>
                  </div>

                  <div>
                    <strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}
                  </div>

                  <div>
                    <strong>Expires At:</strong> {new Date(item.expires_at).toLocaleString()}
                  </div>

                  <div>
                    <strong>Plan:</strong>{" "}
                    <span className="text-indigo-600 font-semibold">
                      {item.plan_name || "Free Plan"}
                    </span>
                  </div>

                  {item.status !== "active" && (
                    <button
                      onClick={() => {
                        const ok = window.confirm("Reactivate this URL for 30 days?");
                        if (ok) reactivateUrl(item.shortcode_id);
                      }}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Reactivate URL
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserUrlHistory;
