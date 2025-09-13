import { useState } from "react";
import api from "../api/axios";
import Message from "../components/Message";

export default function TransactionForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    type: "",
    category: "",
    notes: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/transactions", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: "Transaction added successfully" });

      // ✅ send the new transaction back to parent
      onAdd?.(res.data);

      // reset form
      setFormData({
        title: "",
        amount: "",
        date: "",
        type: "",
        category: "",
        notes: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add transaction",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
      {message && <Message type={message.type} text={message.text} />}

      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        required
        value={formData.amount}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        name="date"
        required
        value={formData.date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Transaction Type */}
      <select
        name="type"
        required
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category Dropdown */}
      <select
        name="category"
        required
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="Income">Income</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Utilities">Utilities</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>

      <textarea
        name="notes"
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      ></textarea>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Add Transaction
      </button>
    </form>
  );
}
