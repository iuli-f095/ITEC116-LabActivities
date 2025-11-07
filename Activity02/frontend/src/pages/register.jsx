import React, { useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/register", { username, password });
      console.log(res.data);

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500); // redirect after 1.5 sec
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || "Username already exists or invalid input";
      setError(serverMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-neutral-900 to-gray-950 p-4">
      <div className="login-card w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Registration
        </h2>

        <form onSubmit={handleRegister} className="w-full space-y-5">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Feedback */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black hover:text-gray-700 font-semibold"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
