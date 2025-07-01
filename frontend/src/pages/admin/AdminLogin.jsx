import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role !== "admin") {
        setError("Access denied: not an admin user");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          email: user.email,
          username: user.username,
          role: user.role,
        })
      );

      setLoading(false);
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Invalid email or password";
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-gray-900" : "bg-orange-100"
      }`}
    >
      {error && (
        <div className="fixed top-6 z-50 bg-red-600 text-white px-5 py-2 rounded shadow-md animate-fade-in-out">
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className={`w-full max-w-sm p-8 rounded-xl shadow-xl border transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-600 dark:text-orange-400">
          Admin Login
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@gmail.com"
            className={`w-full px-4 py-2 rounded border text-sm ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className={`w-full px-4 py-2 rounded border text-sm ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-8 text-gray-500 dark:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition-all flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
