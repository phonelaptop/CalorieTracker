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

app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://main.d238f39xg7s3sq.amplifyapp.com', // Your Amplify frontend
    'https://xmttymakxz.us-west-2.awsapprunner.com' // Your backend (for testing)
  ],
  credentials: true
}));

const port = process.env.PORT || 8080;

const server = async () => {
  try {
    await connectToDatabase();
    console.log("Connected to database successfully");

    app.use("/api/auth", authRoutes);
    app.use("/api/users", requireAuth, userRoutes);
    app.use("/api/ml", requireAuth, mlRoutes);
    app.use("/api/foodentry", requireAuth, foodEntryRoutes);

    app.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

server();