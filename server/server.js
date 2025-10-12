require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./db/db");
const { userRoutes } = require("./routes/userRoutes");
const { authRoutes } = require("./routes/authRoutes");
const { requireAuth } = require("./middleware/authMiddleware");
const { mlRoutes } = require("./routes/mlRoutes");
const { foodEntryRoutes } = require("./routes/foodEntryRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/ml", requireAuth, mlRoutes);
app.use("/api/foodentry", requireAuth, foodEntryRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString() 
  });
});

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();