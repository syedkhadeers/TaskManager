import React,  { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";

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
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border-2 p-2 rounded-md focus-within:border-indigo-500">
          <FiUser className="text-gray-500" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 outline-none"
            required
          />
        </div>
        <div className="flex items-center border-2 p-2 rounded-md focus-within:border-indigo-500">
          <FiMail className="text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 outline-none"
            required
          />
        </div>
        <div className="flex items-center border-2 p-2 rounded-md focus-within:border-indigo-500">
          <FiLock className="text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 outline-none"
            required
          />
        </div>
        <div className="border-2 p-2 rounded-md focus-within:border-indigo-500">
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full p-2 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
