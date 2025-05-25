
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/Cart/CartItem";
import { motion } from "framer-motion";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";


const Cart = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { cart } = userData;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.food.foodItem.price * item.quantity;
  });

  const handleBuyNow = async () => {
    try {
      const res = await axios.post("/restaurant/cart/place-order", {}, {
        withCredentials: true,
      });
  
      const newOrder = res.data.order;
  
      dispatch({ type: "ADD_ORDER_TO_HISTORY", payload: newOrder });
      dispatch({ type: "CLEAR_CART" });
  
      // Send order details to restaurant via socket
      socket.emit("newOrderPlaced", newOrder);
  
      navigate("/history");
    } catch (error) {
      console.error("Error placing order:", error.response?.data?.message || error.message);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <motion.div
        className="max-w-4xl w-full bg-white p-6 shadow-xl rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-5">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <motion.div
            className="text-center text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Cart is Empty
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {cart.map((cartItem, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <CartItem data={cartItem} />
                <div className="hr-line"></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-6 text-lg font-semibold text-gray-700 flex justify-between items-center">
          <span className="mt-3 ml-2">
            Total Price:
            <span className="text-xl ml-3 font-bold text-blue-600">
              ₹{totalPrice.toFixed(2)}
            </span>
          </span>
        </div>

        <motion.button
          className="w-full mt-5 py-3 bg-blue-600 text-black rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBuyNow}
        >
          Buy Now 🚀
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Cart;
