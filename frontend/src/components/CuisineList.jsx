import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";

const CuisineList = ({ restaurantName, refreshKey }) => {
  const navigate = useNavigate();
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await axios.get(`/restaurant/get-all-cusines?restaurant_name=${restaurantName}`);
        console.log(response.data.data);
        setCuisines(response.data.data);
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCuisines();
  }, [restaurantName, refreshKey]); // Refresh when refreshKey changes

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-2 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Cuisines for {restaurantName}
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading cuisines...</p>
        ) : cuisines.length > 0 ? (
          <ul className="space-y-3">
            {cuisines.map((category, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <span>🍽️ {category.category}</span>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow-md transition"
                  onClick={() =>
                    navigate(
                      `/add-food-item?restaurant=${restaurantName}&category=${category.category}`
                    )
                  }
                >
                  Add Food Item
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No cuisines found.</p>
        )}
      </div>
    </div>
  );
};

export default CuisineList;
