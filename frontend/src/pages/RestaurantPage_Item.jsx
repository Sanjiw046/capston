import React, { useState, useEffect } from "react";
import RestaurantCover from "../components/FoodImageCarousel";
import { motion } from "framer-motion";
import FoodItem from "../components/FoodItem";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerFoodItem from "../components/Restaurant/SellerFoodItem";

const RestaurantPage_Item = ({restaurant}) => {
    // console.log('restaurant',restaurant)
    const [cuisineCategory, setCuisineCategory] = useState("");
    const [cuisineFood, setCuisineFood] = useState([]);
    const userData = useSelector((state)=>state.user);

    useEffect(() => {
        const foodCategory = restaurant.cusines.find(
            (item) => item.category === cuisineCategory
        );
        setCuisineFood(foodCategory ? foodCategory.food : []);
    }, [cuisineCategory, restaurant]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4"
        >
            {/* Cover Image & Details */}
            <RestaurantCover
                name={restaurant.name}
                address={restaurant.address}
                imageUrl={restaurant.coverImage}
                contact={restaurant.contact}
            />

            {/* Cuisines Selection */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-center">
                    Select Your Delicious Cuisine
                </h4>

                <div className="flex justify-center gap-4 flex-wrap mt-3">
                    {restaurant.cusines.map((item, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCuisineCategory(item.category)}
                            className={`px-4 py-2 rounded-md border border-gray-300 text-gray-700 transition ${
                                item.category === cuisineCategory
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "hover:bg-gray-200"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {item.category}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Display Food Items */}
            <div className="mt-6 !mt-6">
                {cuisineFood.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData.userRole === "seller" ? (
                            cuisineFood.map((item, index) => (
                                <SellerFoodItem
                                    key={index}
                                    food={item}
                                    category={cuisineCategory}
                                    restaurantName={restaurant.name}
                                />
                            ))
                        ) : (
                            cuisineFood.map((item, index) => (
                                <FoodItem
                                    key={index}
                                    food={item}
                                    category={cuisineCategory}
                                    restaurantName={restaurant.name}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No food available in this category.
                    </p>
                )}
            </div>

        </motion.div>
    );
}

export default RestaurantPage_Item