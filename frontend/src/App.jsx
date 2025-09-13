import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import TransactionsPage from "./pages/TransactionsPage";
import AddTransaction from "./pages/AddTransaction";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditTransactionPage from "./pages/EditTransactionPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const location = useLocation();

  // Hide navbar on landing, login, register, otp pages
  const hideNavbarRoutes = ["/", "/login", "/register", "/verify-otp"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/add"
          element={
            <ProtectedRoute>
              <AddTransaction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/:id/edit"
          element={
            <ProtectedRoute>
              <EditTransactionPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
