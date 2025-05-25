import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import CuisineList from "../components/CuisineList";
import { toast } from "react-toastify";

const AddCuisine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get("restaurant");

  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // For refreshing CuisineList

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/restaurant/cusines-category-add", {
        categories,
        restaurant_name: restaurantName,
      });

      toast.success("Categories added successfully!");
      setCategories(""); // Clear input after successful addition
      setRefreshKey((prevKey) => prevKey + 1); // Refresh the CuisineList
    } catch (error) {
      console.error("Error adding cuisines:", error.response?.data?.message || error.message);
      toast.error("Failed to add cuisines.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding-fix bg-gradient-to-r from-blue-400 to-purple-600 min-h-screen">
      <div>
        <div className="flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Add Cuisine Form */}
            <h2 className="relative pt-3 text-3xl font-extrabold text-center text-gray-800 border-b-4 border-blue-500 shadow-md">
              Add Cuisines for{" "}
              <span className="text-blue-600">{restaurantName}</span>
            </h2>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-6 space-y-6"
            >
              <div>
                <label className="pl-4 mt-4 block text-lg font-semibold text-gray-700">
                  Enter Cuisine Categories (comma-separated)
                </label>
                <div className="pl-4 pr-4">
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
                    type="text"
                    placeholder="E.g. Italian, Chinese, Indian"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 pl-4 pr-4 pb-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-md font-bold text-white transition-all 
                    ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} `}
                >
                  {loading ? "Adding..." : "Add Cuisines"}
                </motion.button>
              </div>
            </motion.form>

            {/* 🟣 Visual Separation for CuisineList */}
            
          </motion.div>
        </div>
        <div className="">
            <CuisineList restaurantName={restaurantName} refreshKey={refreshKey} />
        </div>
      </div>
      
    </div>
  );
};

export default AddCuisine;
