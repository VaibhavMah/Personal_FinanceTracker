const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true }, // always positive
  type: { type: String, enum: ["income", "expense"], required: true }, 
  date: { type: Date, required: true, default: Date.now },
  category: { type: String, required: true, trim: true },
  notes: { type: String },
}, { timestamps: true });


module.exports = mongoose.model("Transaction", TransactionSchema);
