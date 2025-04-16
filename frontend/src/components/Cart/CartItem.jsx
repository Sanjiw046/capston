// 


import React from "react";
import { motion } from "framer-motion";

const CartItem = ({ data, index }) => {
  const { food, quantity } = data;
  
  // Alternate background color based on the index of the item
  const bgColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100';

  return (
    <motion.div
      className={`${bgColor} p-4 shadow-md rounded-lg flex justify-between items-center`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <p className="font-semibold text-gray-800">
          🍔 {food.foodItem.name} - <span className="text-blue-600">₹{food.foodItem.price}</span>
        </p>
        <p className="text-gray-500">Quantity: {quantity}</p>
        <p className="font-bold text-gray-700">Total: ₹{food.foodItem.price * quantity}</p>
        {/* Add a message to indicate the item being added */}
        {/* <p className="text-sm text-green-600 mt-2">Item added to cart!</p> */}
      </div>

      {/* Horizontal line with shadow between items */}
      {/* <hr  className="hr-line" /> */}
      
    </motion.div>
  );
};

export default CartItem;
