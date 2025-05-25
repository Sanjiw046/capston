// components/NotificationToast.jsx
import React from "react";
import { motion } from "framer-motion";

const NotificationToast = ({ message, onClose }) => {
  return (
    <motion.div
        className="fixed top-5 right-5 bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 w-72"
        style={{ zIndex: 999999 }} // <- Add this line
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        >
        <div className="flex justify-between items-start">
            <div>
            <h4 className="text-lg font-semibold text-gray-800">New Order 🚀</h4>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 ml-2">
            ×
            </button>
        </div>
        </motion.div>

  );
};

export default NotificationToast;
