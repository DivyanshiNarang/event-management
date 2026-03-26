require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const morgan   = require("morgan");
const path     = require("path");
const connectDB = require("../config/db");

// Routes
const authRoutes   = require("./routes/auth.routes");
const eventRoutes  = require("./routes/event.routes");
const userRoutes   = require("./routes/user.routes");
const groupRoutes  = require("./routes/group.routes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth",   authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users",  userRoutes);
app.use("/api/groups", groupRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "EventApp API is running 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
