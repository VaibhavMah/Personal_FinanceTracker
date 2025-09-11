const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const authMiddleware = require("../middleware/authMiddleware");
const Transactions = require("../models/Transactions");

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------
// REGISTER
// --------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await user.save();
    await sendEmail(email, "Verify your account", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Invalid body, cannot register" });
  }
});

// --------------------
// VERIFY OTP
// --------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    if (user.otp !== String(otp) || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });
    res.json({ message: "Email verified successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --------------------
// RESEND OTP
// --------------------
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, "Resend OTP", `Your new OTP is: ${otp}`);
    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --------------------
// LOGIN
// --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, googleUser } = req.body;

    if (googleUser) {
      const parsedGoogleUser = JSON.parse(googleUser);
      const { email: googleEmail, name } = parsedGoogleUser;

      let user = await User.findOne({ email: googleEmail });

      if (!user) {
        user = new User({
          username: name,
          email: googleEmail,
          password: "",
          isVerified: true,
        });
        await user.save();
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
      });

      return res.json({ message: "Google login successful", token });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password) {
      return res.status(400).json({ message: "This account was created with Google. Please log in using Google." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --------------------
// GOOGLE LOGIN
// --------------------
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token" });

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        username: payload.name,
        email: payload.email,
        googleId: payload.sub,
        isVerified: true,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token: jwtToken });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
});

// --------------------
// TEST PROTECTED ROUTE (Finance Tracker)
// --------------------
router.post("/test-transaction", authMiddleware, async (req, res) => {
  try {
    const transaction = new Transactions({
      userId: req.user._id,
      title: req.body.title,
      amount: req.body.amount,
      date: req.body.date,
      category: req.body.category,
      notes: req.body.notes,
    });
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Error creating transaction" });
  }
});

// --------------------
// GET AUTH USER
// --------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json(req.user); // already excludes password in middleware
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

module.exports = router;
