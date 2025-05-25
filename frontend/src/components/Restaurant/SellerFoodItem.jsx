import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../../utils/axios';
import socket from '../../utils/socket';
import NotificationToast from '../../components/NotificationToast'; // adjust path as needed
import { toast } from 'react-toastify';

const SellerFoodItem = ({ food, category, restaurantName }) => {
  const { restaurant_id } = useParams();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState(null);

  const addToCartHandler = async (id, category, restaurantName) => {
    try {
      const { data } = await axios.get(
        `/restaurant/add-cart/${id}?category=${category}&restaurant_name=${restaurantName}`
      );
      // console.log(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/restaurant/${restaurant_id}/food/${food._id}?category=${category}&restaurant_name=${restaurantName}`);
  };

  // Listen for new order notifications
  useEffect(() => {
    socket.on('newOrderPlaced', (order) => {
      setToastMessage(`Order placed by ${order.user?.name || 'a user'} with ${order.products.length} item(s).`);
      setTimeout(() => setToastMessage(null), 5000);
    });

    return () => {
      socket.off('newOrderPlaced');
    };
  }, []);

  return (
    <>
      {toastMessage && <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <motion.div
        className="bg-white shadow-lg rounded-2xl overflow-hidden p-4 flex flex-col items-center space-y-3 hover:shadow-2xl transition duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-full h-40 overflow-hidden rounded-xl">
          <img
            src={food?.images[0]?.url}
            alt="food-item"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
          <p className="text-gray-500 text-sm">{food.description}</p>
          <span className="text-lg font-bold text-green-600">₹{food.price}</span>
        </div>

        <div className="flex gap-3">
          <motion.button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            whileTap={{ scale: 0.95 }}
            onClick={handleViewDetails}
          >
            Details
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default SellerFoodItem;
