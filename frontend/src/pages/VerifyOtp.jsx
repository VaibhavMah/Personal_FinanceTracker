import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Message from "../components/Message";

export default function VerifyOtp() {
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", formData);
      localStorage.setItem("token", res.data.token);
      setMessage({ type: "success", text: "Email verified successfully" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Verification failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
  <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-2">
        Personal Finance Tracker
      </h1>
      <h2 className="text-xl font-semibold mb-4 text-center">Verify OTP</h2>

      {message && <Message type={message.type} text={message.text} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="otp"
          placeholder="OTP"
          className="w-full border p-2 rounded"
          value={formData.otp}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Verify
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already verified?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
    </div>
    </div>
  );
}
