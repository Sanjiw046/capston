import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";

const AddFoodItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get("restaurant")?.toLowerCase();
  const category = queryParams.get("category")?.toLowerCase();


  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    veg: "true",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFoodData({ ...foodData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("name", foodData.name.toLowerCase());
    formData.append("price", foodData.price);
    formData.append("veg", foodData.veg.toLowerCase());
    formData.append("description", foodData.description.toLowerCase());
    formData.append("category", category);
    formData.append("restaurant_name", restaurantName);
    if (foodData.image) formData.append("image", foodData.image);
  
    try {
      await axios.post("/restaurant/add-food-items", formData);
      alert("Food item added successfully!");
      
      // Navigate and refresh
      navigate(`/add-cuisine?restaurant=${encodeURIComponent(restaurantName)}`);
    } catch (error) {
      alert("Failed to add food item.");
      console.error("Error adding food item:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="padding-fix">
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/add-restaurantBg.jpg')" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-lg"
        >
          <h2 className="text-4xl md:text-5xl pt-3 pb-3 font-extrabold text-center mb-6 text-gray-800">
            🥘 ADD FOOD ITEM 🥘
          </h2>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block font-semibold pl-2 text-gray-700">Food Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Food Name"
                  value={foodData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                
                <label className="block font-semibold pl-2 text-gray-700">Price:</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter Price"
                  value={foodData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <label className="block font-semibold pl-2 text-gray-700">Description:</label>
                <textarea
                  name="description"
                  placeholder="Enter Description"
                  value={foodData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <label className="block font-semibold pl-2 text-gray-700">Veg:</label>
                <select
                  name="veg"
                  value={foodData.veg}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <label className="block font-semibold pl-2 text-gray-700">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-2 py-1 border bg-gray-100 border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-2 rounded-md font-bold transition-all ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Adding..." : "ADD FOOD ITEM"}
                </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFoodItem;
