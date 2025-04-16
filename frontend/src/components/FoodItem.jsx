import axios from '../utils/axios';
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const FoodItem = ({ food, category, restaurantName }) => {
  // console.log(food);
  const {restaurant_id} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = async (id, category, restaurantName) => {
    try {
      const { data } = await axios.get(
        `/restaurant/add-cart/${id}?category=${category}&restaurant_name=${restaurantName}`
      );

      console.log('cart add:',data);
      // Dispatch update to Redux store with updated cart
      dispatch({ type: "SET_CART", payload: data.data }); // or whatever your response returns
  
      // Optional: success toast/snackbar
      alert("Item added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  // Navigate to the food details page
  const handleViewDetails = () => {
    // console.log(`/food/${food._id}?category=${category}&restaurant_name=${restaurantName}`);
    navigate(`/restaurant/${restaurant_id}/food/${food._id}?category=${category}&restaurant_name=${restaurantName}`);
  };

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-2xl overflow-hidden p-4 flex flex-col items-center space-y-3 hover:shadow-2xl transition duration-300"
      whileHover={{ scale: 1.05 }}
    >
      {/* Food Image */}
      <div className="w-full h-40 overflow-hidden rounded-xl">
        <img
          src={food?.images[0]?.url}
          alt="food-item"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Food Details */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
        <p className="text-gray-500 text-sm">{food.description}</p>
        <span className="text-lg font-bold text-green-600">₹{food.price}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {/* Add to Cart Button */}
        <motion.button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCartHandler(food._id, category, restaurantName)}
        >
          Add To Cart
        </motion.button>

        {/* View Details Button */}
        <motion.button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          whileTap={{ scale: 0.95 }}
          onClick={handleViewDetails}
        >
          Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FoodItem;
