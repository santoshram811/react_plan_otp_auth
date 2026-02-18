const express = require("express");
require("dotenv").config({ path: "./.env" });
const app = express();
const cors = require("cors");
const port = process.env.PORT;

const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://urlshortner.smscannon.in/",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("backend server is running");
});

app.use(authRoutes);
app.use(urlRoutes);

app.use("/subscription", subscriptionRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
