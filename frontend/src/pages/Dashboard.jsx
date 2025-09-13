// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("User");

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(res.data.username || "User");
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUser();
  }, []);

  // ✅ Totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  // ✅ Pie Data
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  // ✅ Bar Data
  const categoryTotals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Number(t.amount);
    });

  const barData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  // ✅ Line Data
  const monthlyTotals = {};
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    if (!monthlyTotals[month]) monthlyTotals[month] = { income: 0, expense: 0 };
    if (t.type === "income") monthlyTotals[month].income += Number(t.amount);
    if (t.type === "expense") monthlyTotals[month].expense += Number(t.amount);
  });

  const lineData = Object.entries(monthlyTotals).map(([month, data]) => ({
    month,
    ...data,
  }));

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-2">Hi, {username} 👋</h1>
      <p className="text-gray-600 mb-6">Here’s your financial overview</p>

      {loading ? (
        <p className="text-gray-500">Loading charts...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 shadow rounded text-center">
              <h2 className="text-lg font-semibold text-gray-600">Balance</h2>
              <p className="text-2xl font-bold text-gray-800">₹{balance}</p>
            </div>
            <div className="bg-white p-4 shadow rounded text-center">
              <h2 className="text-lg font-semibold text-gray-600">Income</h2>
              <p className="text-2xl font-bold text-green-600">₹{income}</p>
            </div>
            <div className="bg-white p-4 shadow rounded text-center">
              <h2 className="text-lg font-semibold text-gray-600">Expenses</h2>
              <p className="text-2xl font-bold text-red-600">₹{expense}</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 shadow rounded mb-6">
            <h2 className="font-semibold mb-2">Income vs Expense</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 shadow rounded mb-6">
            <h2 className="font-semibold mb-2">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 shadow rounded mb-6">
            <h2 className="font-semibold mb-2">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#4CAF50" />
                <Line type="monotone" dataKey="expense" stroke="#F44336" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Button */}
          <button
            onClick={() => navigate("/transactions/add")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Add Transaction
          </button>
          <div className="mt-16 pb-10 text-center text-gray-500">
        <p className="text-sm">
          Made with ❤️ by <span className="font-medium">Vaibhav Maheshwari</span>
        </p>
      </div>
          
        </>
      )}
    </div>
    
  );
}
