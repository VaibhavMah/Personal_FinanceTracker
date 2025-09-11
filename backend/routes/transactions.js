const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transactions");
const authMiddleware = require("../middleware/authMiddleware");

// Create a transaction (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, date, category, notes } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ message: "title, amount and category are required" });
    }

    const tx = new Transaction({
      userId: req.user._id,
      title: title.trim(),
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      category: category.trim(),
      notes,
    });

    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    console.error("Create tx error:", err);
    res.status(500).json({ message: "Could not create transaction" });
  }
});

// Get all transactions for authenticated user (optionally filter / query)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, category, q, sortBy } = req.query;
    const userId = req.user._id;

    const filter = { userId };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (q) filter.title = { $regex: String(q), $options: "i" };

    let sort = { date: -1 };
    if (sortBy === "amount_asc") sort = { amount: 1 };
    if (sortBy === "amount_desc") sort = { amount: -1 };

    const txs = await Transaction.find(filter).sort(sort).lean();
    res.json(txs);
  } catch (err) {
    console.error("Fetch txs error:", err);
    res.status(500).json({ message: "Could not fetch transactions" });
  }
});

// Get a single transaction by id (must belong to user)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(tx);
  } catch (err) {
    console.error("Get tx error:", err);
    res.status(500).json({ message: "Could not fetch transaction" });
  }
});

// Update transaction (protected, owner only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, amount, date, category, notes } = req.body;

    if (title !== undefined) tx.title = title.trim();
    if (amount !== undefined) tx.amount = Number(amount);
    if (date !== undefined) tx.date = new Date(date);
    if (category !== undefined) tx.category = category.trim();
    if (notes !== undefined) tx.notes = notes;

    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error("Update tx error:", err);
    res.status(500).json({ message: "Could not update transaction" });
  }
});

// Delete transaction (protected, owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await tx.deleteOne(); // ✅ correct way in Mongoose 6+
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete tx error:", err);
    res.status(500).json({ message: "Could not delete transaction" });
  }
});


module.exports = router;
