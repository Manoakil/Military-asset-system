import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PurchasePage from "./pages/PurchaseForm";
import TransfersPage from "./pages/Transfers";
import AssignmentsAndExpenditures from "./pages/AssignmentsExpeditures";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path ? "border-b-2 border-white text-white" : "text-blue-100 hover:text-white";

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span>🎖️</span> Military Asset System
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className={`pb-2 transition ${isActive('/')}`}>Dashboard</Link>
          <Link to="/purchases" className={`pb-2 transition ${isActive('/purchases')}`}>Purchases</Link>
          <Link to="/transfers" className={`pb-2 transition ${isActive('/transfers')}`}>Transfers</Link>
          <Link to="/assignments" className={`pb-2 transition ${isActive('/assignments')}`}>Assignments</Link>

          <div className="flex items-center gap-4 pl-6 border-l border-blue-400">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-blue-200">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <NavBar />
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <PrivateRoute>
              <NavBar />
              <PurchasePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/transfers"
          element={
            <PrivateRoute>
              <NavBar />
              <TransfersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <PrivateRoute>
              <NavBar />
              <AssignmentsAndExpenditures />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
