// src/components/auth/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error message
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    setError(null); // Reset error state

    try {
      const response = await loginUser({ email, password });
      if (response) {
        navigate("/dashboard"); // Redirect to dashboard on success
      }
    } catch (error) {
      setError(error.message); // Set error message from the caught error
    } finally {
      setLoading(false); // Set loading to false when the request ends
    }
  };

  return (
    <section className="py-4 md:py-8 bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:bg-neutral-900 md:mt-0 sm:max-w-md xl:p-0 text-text-light dark:text-text-dark border dark:border-neutral-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h2 className="text-md font-bold leading-tight tracking-tight md:text-2xl text-center">
              Sign In Access
            </h2>
            <p className="text-center text-neutral-600 dark:text-neutral-300">
              You must become a member to Login and access the entire site
            </p>

            {error && (
              <div className="text-red-500 text-center">
                {error} {/* Display error message */}
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="login"
                  id="email"
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 sm:text-sm rounded-lg focus:ring-primary-light focus:border-primary-light block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-primary-light dark:focus:border-primary-light"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 sm:text-sm rounded-lg focus:ring-primary-light focus:border-primary-light block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-primary-light dark:focus:border-primary-light"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-secondary-dark hover:underline dark:text-secondary-dark"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`text-white bg-primary-dark hover:bg-primary-dark py-1.5 px-4 rounded w-full transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed " : ""
                }`}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Signing In..." : "SIGN IN"}{" "}
                {/* Show loading text */}
              </button>

              <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">
                Not a member yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-secondary-dark hover:underline dark:text-secondary-dark"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
