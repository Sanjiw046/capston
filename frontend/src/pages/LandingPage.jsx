import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-200 relative overflow-hidden px-4">
      
      {/* Background animated blobs */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-400 rounded-full top-0 -left-20 opacity-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-indigo-300 rounded-full bottom-0 -right-16 opacity-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1.5 }}
      />

      {/* Main card */}
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 z-10 max-w-3xl text-center w-full border-t-8 border-purple-600"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-4 pt-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to Capston Food App 🍱
        </motion.h2>

        <p className="text-gray-700 text-lg md:text-xl mb-8">
          Delicious meals, amazing restaurants, and fast delivery – all at your fingertips.
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/signup')}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-3 rounded-sm text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
        >
          🚀 Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
