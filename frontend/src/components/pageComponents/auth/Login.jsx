import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiErrorCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, setError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   if (authError) {
  //     setErrors({ general: authError });
  //   }
  //   return () => setError(null);
  // }, [authError, setError]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation Errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Attempting login with:", formData);
      const response = await login(formData);
      console.log("Login Response:", response);
      const redirectPath = location.state?.from || "/dashboard";
      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.log("Login Error:", error);
      setErrors({
        general: error.message || "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-block p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 mt-2">
            Sign in to continue to your dashboard
          </p>
        </div>

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-900/40 border border-red-800/40 p-4 rounded-xl"
          >
            <BiErrorCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium text-red-400">{errors.general}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                name="email"
                className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                name="password"
                className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <RiLockPasswordLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
