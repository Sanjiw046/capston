import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDist } from "../../redux/Slices/distanceSlice"; // Adjust path if needed


const Restaurant = ({ restaurant }) => {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  //if available lat and lng in localstorage

  // ⬇️ Get user lat/lng from Redux
  const { lat: reduxLat, lng: reduxLng } = useSelector((state) => state.user);

  const lat = reduxLat ?? parseFloat(localStorage.getItem('userLat'));
  const lng = reduxLng ?? parseFloat(localStorage.getItem('userLng'));

  

  const getDistance = async () => {
    try {
      const response = await axios.get('/api/distanceMapbox', {
        params: {
          userLat: lat,
          userLng: lng,
          restaurantLat: restaurant.latAndLang?.[0]?.latitude,
          restaurantLng: restaurant.latAndLang?.[0]?.longitude,
        },
      });
  
      const { distance_km: dist, duration_minutes: dur } = response.data;
  
      setDistance(dist);
      setDuration(dur);
  
      // Store in Redux for future reuse
      dispatch(setDist({
        restaurantId: restaurant._id,
        distance: dist,
        duration: dur,
        userLocation: { lat, lng },
      }));
  
    } catch (error) {
      console.error("Error fetching distance:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const stored = useSelector((state) => state.distanceReducer.distances[restaurant._id]);

useEffect(() => {
  if (
    lat != null && lng != null &&
    restaurant?.latAndLang?.[0]?.latitude &&
    restaurant?.latAndLang?.[0]?.longitude
  ) {
    if (stored && stored.userLocation.lat === lat && stored.userLocation.lng === lng) {
      setDistance(stored.distance);
      setDuration(stored.duration);
      setLoading(false);
    } else {
      getDistance();
    }
  }
}, [lat, lng, restaurant, stored]);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden w-60 transform transition-transform hover:scale-105 flex flex-col w-full h-full relative"
    >
      {/* Cover Image */}
      <div className="rounded-lg p-2 overflow-hidden relative">
        <Link to={restaurant._id}>
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="h-37 w-full object-cover rounded-lg"
          />
        </Link>

        {restaurant.discount && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-t from-black/80 to-transparent px-2 py-1 rounded-md leading-tight">
            <span className="text-white text-sm font-semibold block">Up to</span>
            <span className="text-white text-lg font-semibold">{restaurant.discount}% OFF</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-2 flex-grow flex flex-col justify-between">
        <h5 className="text-sm capitalize font-semibold mb-0">{restaurant.name}</h5>

        <p className="text-gray-600 text-md mb-1">
          {restaurant.cusines.slice(0, 3).map((c, index) => (
            <span key={index} className="capitalize text-grey-500">
              {c.category}
              {index !== Math.min(restaurant.cusines.length, 3) - 1 ? ", " : ""}
            </span>
          ))}
        </p>

        <span className="text-gray-500 text-sm flex items-center">
          <img src="location.png" className="w-4 h-4 mr-1" alt="Location" /> 
          <span>{restaurant.address}</span>
        </span>

        <div className="text-gray-600 text-xs mt-1">
          {loading ? (
            <p>Calculating distance...</p>
          ) : distance && duration ? (
            <p>📍 {distance} | ⏳ {duration}</p>
          ) : (
            <p className="text-red-500">Could not calculate distance</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Restaurant;
