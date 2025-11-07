import React, { useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.access_token;

      // ✅ Save token to localStorage
      localStorage.setItem("token", token);

      // ✅ Set auth header globally for future requests
      setAuthToken(token);

      // ✅ Success message + redirect
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/notes"), 1500); // redirect after 1.5 sec
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || "Invalid username or password";
      setError(serverMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
      <div className="login-card w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Sign In
        </h2>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Error / Success message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register redirect */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          No account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
