import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

const Login = () => {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await handleLogin({ email, password });
      window.location.reload();
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <FiUser className="text-8xl text-primary-dark dark:text-primary-light rounded-full p-2 border-2 border-light dark:border-dark" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Welcome Back
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AiOutlineMail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="password"
              className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <RiLockPasswordLine className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex justify-between items-center text-sm ">
            <Link
              to="/forgot-password"
              className="text-gray-800 dark:text-gray-200 underline underline-offset-8 "
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className={`${
              isDarkMode
                ? "px-3 py-3 w-full text-white bg-gradient-light rounded-lg transition hover:bg-gradient-dark hover:text-primary-100 border border-neutral-800"
                : "px-3 py-3 w-full text-white bg-gradient-dark rounded-lg transition hover:bg-gradient-light hover:text-primary-50 border border-neutral-100"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary-light dark:text-primary-dark font-bold underline underline-offset-8"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
