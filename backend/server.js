const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const transactionsRouter = require("./routes/transactions");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173", // dev
    "https://personal-finance-tracker-two-gamma.vercel.app" // vercel frontend
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MONGO_URI is not defined in environment variables!");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
