import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate,Link } from "react-router-dom";
import axios from "../utils/axios";
import Footer from "../components/Restaurant/Footer";

const RegisterRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  const fetchMyRestaurants = async () => {
    try {
      const response = await axios.get("/restaurant/get-my-restaurants");
      setRestaurants(response.data.data);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  return (

    <div className="min-h-screen bg-cover bg-center bg-no-repeat py-10 padding-fix">      
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md w-full  py-6">
          <div className="flex justify-center items-center relative mb-12 pt-4 rounded-lg">
                <h1 className="text-4xl font-extrabold text-gray-800">
                  🍽️ MANAGE YOUR RESTAURANTS 🍽️
                </h1>
                <button  
                  onClick={() => navigate("/add-restaurant")} 
                  className="absolute right-4 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg hover:bg-green-700">
                  ADD RESTAURANT
                </button>
          </div> 
          
          <div className="flex justify-center shadow-md pb-2">
            <motion.img 
              src="/categories/res-manage.png" 
              className="w-40 h-auto" 
              alt="Manage Restaurants"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, ease: "easeOut" }} 
            />
          </div>     
        </div>

        <div className="m-4">
          <div className="grid md:grid-cols-4 gap-6 mt-12">
              {restaurants.map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden w-60 transform transition-transform hover:scale-105 flex flex-col w-full h-full relative"
                >
                  {/* Cover Image */}
                  <div className="rounded-lg p-2 overflow-hidden relative">
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="h-37 w-full object-cover rounded-lg"
                      />
                  </div>

                  {/* Content Section */}
                  <div className="p-2 flex-grow flex flex-col justify-between">
                    {/* Restaurant Name */}
                    <h5 className="text-sm capitalize font-semibold mb-0">{restaurant.name}</h5>

                    {/* Location */}
                    <span className="text-gray-500 text-sm text-capitalize flex items-center">
                      <img src="location.png" className="w-4 h-4 mr-1" alt="Location" />
                      <span>{restaurant.address}</span>
                    </span>

                    {/* Update Button */}
                    <button
                      onClick={() => navigate(`/register-restaurant/update-restaurant?restaurant=${encodeURIComponent(restaurant.name)}`)}
                      className="w-full bg-blue-600 text-white uppercase py-2 rounded-lg text-sm font-medium hover:bg-blue-700 mt-2"
                    >
                      UPDATE
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>  

      <div className="mt-4">
          <Footer/>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
