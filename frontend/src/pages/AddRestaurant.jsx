import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    contact: "",
    coverImage: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setRestaurantData({ ...restaurantData, coverImage: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", restaurantData.name);
    formData.append("address", restaurantData.address);
    formData.append("contact", restaurantData.contact);
    formData.append("coverImage", restaurantData.coverImage);
    formData.append("discount",restaurantData.discount);

    try {
      await axios.post("/restaurant/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Restaurant added successfully!");
      // navigate("/register-restaurant");
      navigate(`/add-cuisine?restaurant=${encodeURIComponent(restaurantData.name)}`);
    } 
    catch (error) {
      console.error("Error adding restaurant:", error.response.data.message);
      toast.error("Failed to add restaurant.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/add-restaurantBg.jpg')" }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-4xl md:text-5xl pt-3 pb-3 font-extrabold text-center mb-6 text-gray-800">
        🍽️ ADD NEW RESTAURANT 🍽️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Restaurant Name */}
          <div>
            <label className="block font-semibold pl-2 text-gray-700">Restaurant Name</label>
            <input 
              type="text"
              name="name"
              placeholder="Enter Restaurant Name"
              value={restaurantData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold pl-2 text-gray-700">Address</label>
            <input 
              type="text"
              name="address"
              placeholder="Enter Address"
              value={restaurantData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-semibold pl-2 text-gray-700">Contact</label>
            <input 
              type="text"
              name="contact"
              placeholder="Enter Contact no."
              value={restaurantData.contact}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* discount */}
          <div>
            <label className="block font-semibold pl-2 text-gray-700">Discount</label>
            <input 
              type="text"
              name="discount"
              placeholder="Enter discount."
              value={restaurantData.discount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold pl-2 text-gray-700">Cover Image</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md font-bold transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Adding..." : "ADD RESTAURANT"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRestaurant;
