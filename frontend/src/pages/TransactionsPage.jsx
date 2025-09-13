import { useEffect, useState } from "react";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import { Link } from "react-router-dom";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Add transaction
  const handleAdd = async (tx) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/transactions", tx, {
        headers: { Authorization: `Bearer ${token}` },
      });
setTransactions((prev) => [res.data, ...prev]); 
    } catch (err) {
      alert(err.response?.data?.message || "Could not add transaction");
    }
  };

  // 🔹 Delete transaction
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
      <TransactionForm onAdd={handleAdd} />
      
      {loading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="mt-4 text-gray-500">No transactions yet.</p>
      ) : (
        <div className="space-y-3 mt-4">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex justify-between items-center border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div>
                <h3 className="font-medium text-lg">{tx.title}</h3>
                <p className="text-sm text-gray-500">
                  {tx.category} • {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg text-blue-600">₹{tx.amount}</div>
                <Link
      to={`/transactions/${tx._id}/edit`}
      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Edit
    </Link>
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
