import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import {
  FaHotel,
  FaConciergeBell,
  FaCalendarCheck,
  FaChartLine,
  FaUserTie,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaCocktail,
  FaSpa,
} from "react-icons/fa";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  useEffect(() => {
    return scrollY.onChange(() => setIsScrolled(scrollY.get() > 50));
  }, [scrollY]);

  const navbarClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled
      ? "py-4 bg-white/90 backdrop-blur-lg shadow-lg dark:bg-gray-900/90"
      : "py-6 bg-transparent"
  }`;

  const hotelFeatures = [
    {
      icon: FaCalendarCheck,
      title: "Smart Booking Management",
      description:
        "Streamline reservations with our intelligent booking system",
    },
    {
      icon: FaConciergeBell,
      title: "Concierge Services",
      description: "Manage guest requests and services efficiently",
    },
    {
      icon: FaChartLine,
      title: "Revenue Analytics",
      description: "Real-time insights into your hotel's performance",
    },
    {
      icon: FaUserTie,
      title: "Staff Management",
      description: "Optimize workforce scheduling and management",
    },
  ];

  const hotelAmenities = [
    { icon: FaWifi, name: "High-Speed WiFi" },
    { icon: FaSwimmingPool, name: "Swimming Pool" },
    { icon: FaUtensils, name: "Restaurant" },
    { icon: FaCocktail, name: "Bar" },
    { icon: FaSpa, name: "Spa" },
  ];

  const testimonials = [
    {
      name: "James Wilson",
      role: "General Manager, Grand Hotel",
      content:
        "This software revolutionized our hotel operations. Bookings increased by 45%!",
      avatar: "./4.jpg",
    },
    {
      name: "Sarah Chen",
      role: "Operations Director, Luxury Resorts",
      content:
        "The analytics features helped us optimize pricing and increase revenue by 30%.",
      avatar: "./5.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Owner, Boutique Hotels Chain",
      content:
        "Customer satisfaction improved dramatically with the streamlined check-in process.",
      avatar: "./6.png",
    },
  ];

  const statistics = [
    { number: "500+", label: "Hotels Worldwide" },
    { number: "1M+", label: "Bookings Monthly" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={navbarClasses}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="./logo.png" alt="Hotel Management Logo" className="w-60" />
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 hover:text-primary-dark transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 mb-6"
            >
              #1 Hotel Management Solution
            </motion.div>

            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Transform Your Hotel Management
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Streamline operations, boost revenue, and delight guests with our
              all-in-one hotel management platform.
            </p>

            <div className="flex space-x-4">
              <Link
                to="/demo"
                className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
              >
                Request Demo
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="./main_bg.jpg"
              alt="Hotel Management Dashboard"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Hotels
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to manage your property efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hotelFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-xl transition duration-300"
              >
                <feature.icon className="text-4xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="text-4xl font-bold mb-2">{stat.number}</h4>
                <p className="text-lg opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Hoteliers Worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {testimonial.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Hotel Operations?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful hotels already using our platform
            </p>
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition duration-300 inline-flex items-center"
            >
              <FaHotel className="mr-2" /> Start Your Free Trial
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
