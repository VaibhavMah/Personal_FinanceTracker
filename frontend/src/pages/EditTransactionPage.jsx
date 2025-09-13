import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditTransactionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch transaction by ID
  useEffect(() => {
    const fetchTx = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          title: res.data.title,
          amount: res.data.amount,
          date: res.data.date.split("T")[0], // format for <input type="date" />
          category: res.data.category,
          notes: res.data.notes || "",
        });
      } catch (err) {
        console.error("Fetch single tx error:", err);
        alert("Failed to fetch transaction");
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [id]);

  // 🔹 Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`/transactions/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Transaction updated");
      navigate("/transactions");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-6 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
}
