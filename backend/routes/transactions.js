const { Router } = require("express");
const Transaction = require("../models/Transactions");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

// --------------------
// CREATE
// --------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const tx = new Transaction({
      userId: req.user._id,
      title,
      amount,
      type,       // now this comes from req.body
      category,
      date,
      notes,
    });

    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    console.error("Add transaction error:", err);
    res.status(500).json({ message: "Could not add transaction" });
  }
});



// --------------------
// READ ALL (User's Transactions)
// --------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error("Fetch transactions error:", err);
    res.status(500).json({ message: "Could not fetch transactions" });
  }
});

// --------------------
// READ SINGLE
// --------------------
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(tx);
  } catch (err) {
    console.error("Get single tx error:", err);
    res.status(500).json({ message: "Could not fetch transaction" });
  }
});

// --------------------
// UPDATE
// --------------------
// UPDATE
// --------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, date, category, notes } = req.body;
    const tx = await Transaction.findById(req.params.id);

    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    tx.title = title ?? tx.title;

    if (amount !== undefined) {
      if (type === "expense") {
        tx.amount = -Math.abs(amount);
      } else if (type === "income") {
        tx.amount = Math.abs(amount);
      }
    }

    tx.type = type ?? tx.type;
    tx.date = date ?? tx.date;
    tx.category = category ?? tx.category;
    tx.notes = notes ?? tx.notes;

    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error("Update tx error:", err);
    res.status(500).json({ message: "Could not update transaction" });
  }
});

// --------------------
// DELETE
// --------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Transaction.deleteOne({ _id: req.params.id });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete tx error:", err);
    res.status(500).json({ message: "Could not delete transaction" });
  }
});

module.exports = router;
