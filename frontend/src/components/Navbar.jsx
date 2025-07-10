// src/components/Navbar.jsx
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useFirebase } from "../Firebase.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useFirebase();

  const isActive = (path) => location.pathname === path;
  console.log(user)

  const handleLogout = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/auth/logout",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUser(null);
      toast.success(data.msg || "Logged out");
      navigate("/login");
    } else {
      toast.error(data.msg || "Logout failed");
    }
  } catch (err) {
    // this only fires on network errors or if JSON parsing throws
    console.error("Logout error:", err);
    toast.error("Internal server error");
  }
};


  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-indigo-600">
              Expense Book
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-md font-medium ${
                isActive("/") ? "text-blue-400" : "text-gray-700"
              } hover:text-indigo-600`}
            >
              Home
            </Link>
            <Link
              to="/analysis"
              className={`px-3 py-2 rounded-md text-md font-medium ${
                isActive("/analysis")
                  ? "text-blue-400"
                  : "text-gray-700"
              } hover:text-indigo-600`}
            >
              Analysis
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user!==null ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Signup
                </Link>
              </>
            )}

            <Link
              to="/profile"
              className="text-3xl text-gray-700 hover:text-indigo-600 transition"
            >
              <FaUserCircle
                className={isActive("/profile") ? "text-blue-400" : ""}
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
