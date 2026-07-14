// frontend/src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0B0F19] text-white min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold tracking-wide">
          FinanceTracker
        </h1>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 hover:text-white transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center mt-24 px-6">

        <motion.h1
          className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Take Control of Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Finances
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-gray-400 max-w-xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Track expenses, monitor savings, and gain insights into your financial habits — all in one place.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl text-lg font-medium shadow-lg shadow-indigo-500/30 transition"
          >
            Get Started Free
          </button>
        </motion.div>
      </section>

      {/* ================= PREVIEW (IMPORTANT) ================= */}
      {/* <section className="mt-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#111827] rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="h-64 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-gray-400">
            
          </div>
        </div>
      </section> */}

      {/* ================= FEATURES ================= */}
      <section className="mt-28 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Everything you need to manage money
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "Expense Tracking",
            "Smart Analytics",
            "Budget Planning",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#111827] p-6 rounded-xl border border-white/10 hover:border-indigo-500/40 transition"
            >
              <h3 className="text-xl font-medium mb-3">{item}</h3>
              <p className="text-gray-400 text-sm">
                Easily monitor and control your financial activity with powerful tools.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mt-28 text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">
          Start your financial journey today
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition"
        >
          Get Started
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-24 text-center text-gray-500 pb-10">
        © 2026 FinanceTracker. All rights reserved.
      </footer>

    </div>
  );
}