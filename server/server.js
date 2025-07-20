require("dotenv").config({ path: "../.env" });

const express = require("express");
const { connectToDatabase } = require("./db/db");
const { userRoutes } = require("./routes/userRoutes");
const { authRoutes } = require("./routes/authRoutes");
const { requireAuth } = require("./middleware/authMiddleware");
const { mlRoutes } = require("./routes/mlRoutes");
const { foodEntryRoutes } = require("./routes/foodEntryRoutes");

const app = express();
app.use(express.json());
const port = 4000;

const server = async () => {
  await connectToDatabase();

  app.use("/api/auth", authRoutes);
  app.use("/api/users", requireAuth, userRoutes);
  app.use("/api/ml", requireAuth, mlRoutes);
  app.use("/api/foodentry", requireAuth, foodEntryRoutes);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

server();