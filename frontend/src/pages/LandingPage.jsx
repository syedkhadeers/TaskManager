import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";
import ThemeToggle from "../components/common/ThemeToggle"; // Import the new component
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../hooks/useAuth"; // Custom hook to get auth state
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LandingPage = () => {

   const { isAuthenticated } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
     if (isAuthenticated) {
       toast.success("You have already logged in");
       navigate("/dashboard");
     }
   }, [isAuthenticated, navigate]);

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
          <div className="text-left">
            <h1 className="text-5xl font-bold text-primary-dark mb-6 leading-tight">
              Revolutionize Your Productivity
            </h1>
            <p className="text-xl text-text-light dark:text-text-dark mb-8">
              Streamline your workflow, collaborate effortlessly, and achieve
              more with TaskMaster's intelligent project management platform.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-secondary-light text-white rounded-md hover:bg-secondary-dark transition duration-300 flex items-center"
              >
                
                <FaRocket className="mr-2" /> Get Started
              </Link>
              <Link
                to="/features"
                className="px-6 py-3 border-2 border-primary-dark text-primary-dark rounded-md hover:bg-primary-light hover:text-white transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div>
            <img
              src="./hero1.jpg"
              alt="Productivity"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Designed to supercharge your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaChartLine,
                title: "Advanced Analytics",
                description:
                  "Gain deep insights into your productivity with comprehensive performance tracking.",
              },
              {
                icon: FaUsers,
                title: "Team Collaboration",
                description:
                  "Seamlessly collaborate with your team in real-time, breaking down communication barriers.",
              },
              {
                icon: FaLightbulb,
                title: "Smart Suggestions",
                description:
                  "AI-powered recommendations to optimize your workflow and boost efficiency.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition duration-300"
              >
                <feature.icon className="text-4xl text-secondary-light mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of the sections remain mostly the same */}
      {/* ... (Testimonials, CTA, Footer) ... */}
    </div>
  );
};

export default LandingPage;
