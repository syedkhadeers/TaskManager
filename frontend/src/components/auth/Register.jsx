import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUser, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/authServices";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser({ name, email, password, photo });
    if (response) {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <FiUserPlus className="text-8xl text-primary-dark dark:text-primary-light rounded-full p-2 border-2 border-light dark:border-dark" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FiUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
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
          <div className="relative">
            <input
              type="file"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="px-3 py-3 w-full text-white bg-gradient-dark rounded-lg transition hover:bg-gradient-light hover:text-primary-50 border border-neutral-100"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-light dark:text-primary-dark font-bold underline underline-offset-8"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
