import { useEffect, useState } from "react";
import api from "../api/axios";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  // Fetch all transactions once
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  // ✅ Add transaction and update state instantly
  const handleAdd = async (newTx) => {
    try {
      const res = await api.post("/transactions", newTx);
      setTransactions((prev) => [res.data, ...prev]); // update instantly
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  // ✅ Delete transaction and update state instantly
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  // ✅ Update transaction and update state instantly
  const handleUpdate = async (id, updatedTx) => {
    try {
      const res = await api.put(`/transactions/${id}`, updatedTx);
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? res.data : tx))
      );
    } catch (err) {
      console.error("Failed to update transaction", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {/* Example form to add transaction */}
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() =>
          handleAdd({
            title: "New Item",
            category: "Income",
            amount: 1000,
            date: new Date(),
          })
        }
      >
        + Add Transaction
      </button>

      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
