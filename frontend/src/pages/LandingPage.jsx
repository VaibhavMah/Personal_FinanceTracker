// frontend/src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
      {/* Title */}
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Personal Finance Tracker
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-lg mb-10 text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Take control of your expenses, track your savings, and achieve your financial goals effortlessly.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow-lg font-medium hover:scale-105 hover:bg-gray-100 transition transform"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl shadow-lg font-medium hover:scale-105 hover:bg-yellow-300 transition transform"
        >
          Register
        </button>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-20 text-sm text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Made with ❤️ by <span className="font-medium">Vaibhav Maheshwari</span>
      </motion.div>
    </div>
  );
}
