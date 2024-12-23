// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   FaRocket,
//   FaChartLine,
//   FaUsers,
//   FaLightbulb,
// } from "react-icons/fa";
// const LandingPage = () => {
  

  // const fadeInUp = {
  //   initial: { opacity: 0, y: 20 },
  //   animate: { opacity: 1, y: 0 },
  //   transition: { duration: 0.6 },
  // };

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-gray-900">


//       {/* Hero Section */}
//       <header className="relative w-full min-h-screen flex items-center justify-center pt-16">
//         <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
//           <motion.div
//             className="text-left"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-secondary-light mb-6 leading-tight">
//               Revolutionize Your Productivity
//             </h1>
            // <p className="text-xl text-text-light dark:text-text-dark mb-8">
            //   Streamline your workflow, collaborate effortlessly, and achieve
            //   more with our intelligent project management platform.
            // </p>
            // <div className="flex space-x-4">
            //   <Link
            //     to="/register"
            //     className="px-8 py-4 bg-gradient-to-r from-secondary-light to-primary-dark text-white rounded-full hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center"
            //   >
            //     <FaRocket className="mr-2" /> Get Started Free
            //   </Link>
            //   <Link
            //     to="/features"
            //     className="px-8 py-4 border-2 border-primary-dark text-primary-dark rounded-full hover:bg-primary-dark hover:text-white transition duration-300"
            //   >
            //     Watch Demo
            //   </Link>
            // </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <img
//               src="/hero1.jpg"
//               alt="Productivity"
//               className="rounded-2xl shadow-2xl"
//             />
//           </motion.div>
//         </div>
//       </header>

//       {/* Features Section */}
      // <section className="py-20 bg-gray-50 dark:bg-gray-800">
      //   <div className="container mx-auto px-6">
      //     <motion.div className="text-center mb-16" {...fadeInUp}>
      //       <h2 className="text-4xl font-bold text-primary-dark mb-4">
      //         Powerful Features
      //       </h2>
      //       <p className="text-xl text-gray-600 dark:text-gray-300">
      //         Designed to supercharge your productivity
      //       </p>
      //     </motion.div>

      //     <div className="grid md:grid-cols-3 gap-8">
      //       {[
      //         {
      //           icon: FaChartLine,
      //           title: "Advanced Analytics",
      //           description:
      //             "Gain deep insights into your productivity with comprehensive performance tracking.",
      //         },
      //         {
      //           icon: FaUsers,
      //           title: "Team Collaboration",
      //           description:
      //             "Seamlessly collaborate with your team in real-time, breaking down communication barriers.",
      //         },
      //         {
      //           icon: FaLightbulb,
      //           title: "Smart Suggestions",
      //           description:
      //             "AI-powered recommendations to optimize your workflow and boost efficiency.",
      //         },
      //       ].map((feature, index) => (
      //         <motion.div
      //           key={index}
      //           initial={{ opacity: 0, y: 20 }}
      //           animate={{ opacity: 1, y: 0 }}
      //           transition={{ duration: 0.5, delay: index * 0.1 }}
      //           className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
      //         >
      //           <feature.icon className="text-5xl text-secondary-light mb-6" />
      //           <h3 className="text-2xl font-semibold mb-4 text-primary-dark dark:text-white">
      //             {feature.title}
      //           </h3>
      //           <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      //             {feature.description}
      //           </p>
      //         </motion.div>
      //       ))}
      //     </div>
      //   </div>
      // </section>

      // {/* Statistics Section */}
      // <section className="py-20 bg-gradient-to-r from-primary-dark to-secondary-light text-white">
      //   <div className="container mx-auto px-6">
      //     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      //       {[
      //         { number: "10K+", label: "Active Users" },
      //         { number: "50M+", label: "Tasks Completed" },
      //         { number: "99.9%", label: "Uptime" },
      //         { number: "24/7", label: "Support" },
      //       ].map((stat, index) => (
      //         <motion.div
      //           key={index}
      //           initial={{ opacity: 0, y: 20 }}
      //           whileInView={{ opacity: 1, y: 0 }}
      //           viewport={{ once: true }}
      //           transition={{ duration: 0.5, delay: index * 0.1 }}
      //         >
      //           <h4 className="text-4xl font-bold mb-2">{stat.number}</h4>
      //           <p className="text-lg opacity-80">{stat.label}</p>
      //         </motion.div>
      //       ))}
      //     </div>
      //   </div>
      // </section>

      // {/* Testimonials Section */}
      // <section className="py-20 bg-white dark:bg-gray-900">
      //   <div className="container mx-auto px-6">
      //     <motion.div className="text-center mb-16" {...fadeInUp}>
      //       <h2 className="text-4xl font-bold text-primary-dark dark:text-white mb-4">
      //         What Our Users Say
      //       </h2>
      //       <p className="text-xl text-gray-600 dark:text-gray-400">
      //         Join thousands of satisfied customers
      //       </p>
      //     </motion.div>

      //     <div className="grid md:grid-cols-3 gap-8">
      //       {[
      //         {
      //           name: "John Doe",
      //           role: "CEO, TechCorp",
      //           content:
      //             "This platform has transformed how we manage our projects.",
      //           avatar: "/avatar1.jpg",
      //         },
      //         // Add more testimonials
      //       ].map((testimonial, index) => (
      //         <motion.div
      //           key={index}
      //           initial={{ opacity: 0, y: 20 }}
      //           whileInView={{ opacity: 1, y: 0 }}
      //           viewport={{ once: true }}
      //           transition={{ duration: 0.5, delay: index * 0.1 }}
      //           className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      //         >
      //           {/* Testimonial content */}
      //         </motion.div>
      //       ))}
      //     </div>
      //   </div>
      // </section>

      // {/* CTA Section */}
      // <section className="py-20 bg-primary-dark dark:bg-gray-800">
      //   <div className="container mx-auto px-6 text-center">
      //     <motion.div
      //       initial={{ opacity: 0, y: 20 }}
      //       whileInView={{ opacity: 1, y: 0 }}
      //       viewport={{ once: true }}
      //       className="max-w-3xl mx-auto"
      //     >
      //       <h2 className="text-4xl font-bold text-white mb-6">
      //         Ready to Get Started?
      //       </h2>
      //       <p className="text-xl text-gray-300 mb-8">
      //         Join thousands of teams already using our platform
      //       </p>
      //       <Link
      //         to="/register"
      //         className="px-8 py-4 bg-white text-primary-dark rounded-full hover:shadow-lg transform hover:-translate-y-1 transition duration-300 inline-flex items-center"
      //       >
      //         <FaRocket className="mr-2" /> Start Free Trial
      //       </Link>
      //     </motion.div>
      //   </div>
      // </section>
//     </div>
//   );
// };

// export default LandingPage;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { FaRocket, FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";

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
      ? "py-4 bg-white/80 backdrop-blur-lg shadow-lg dark:bg-gray-900/80"
      : "py-6 bg-transparent"
  }`;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-gray-900">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={navbarClasses}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="./logo_light.png" alt="Logo" className="h-10 w-auto" />
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 dark:text-white hover:text-primary-dark transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-primary-dark to-secondary-light text-white rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with enhanced design */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/5 to-secondary-light/5 dark:from-primary-dark/10 dark:to-secondary-light/10" />
        <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
          <motion.div
            className="text-left relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-primary-dark/10 dark:bg-primary-dark/20 rounded-full text-primary-dark dark:text-primary-light mb-6"
            >
              🚀 Launching something special
            </motion.div>

            <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-secondary-light mb-8 leading-tight">
              Revolutionize Your Productivity
            </h1>

            <p className="text-xl text-text-light dark:text-text-dark mb-8">
              Streamline your workflow, collaborate effortlessly, and achieve
              more with our intelligent project management platform.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-secondary-light to-primary-dark text-white rounded-full hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center"
              >
                <FaRocket className="mr-2" /> Get Started Free
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 border-2 border-primary-dark text-primary-dark rounded-full hover:bg-primary-dark hover:text-white transition duration-300"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-dark/20 to-secondary-light/20 rounded-2xl blur-xl" />
              <img
                src="/hero1.jpg"
                alt="Productivity"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </header>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-primary-dark mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Designed to supercharge your productivity
            </p>
          </motion.div>

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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
              >
                <feature.icon className="text-5xl text-secondary-light mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-primary-dark dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-primary-dark to-secondary-light text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50M+", label: "Tasks Completed" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-primary-dark dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of satisfied customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "CEO, TechCorp",
                content:
                  "This platform has transformed how we manage our projects.",
                avatar: "/avatar1.jpg",
              },
              // Add more testimonials
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                {/* Testimonial content */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-dark dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already using our platform
            </p>
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-dark rounded-full hover:shadow-lg transform hover:-translate-y-1 transition duration-300 inline-flex items-center"
            >
              <FaRocket className="mr-2" /> Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
