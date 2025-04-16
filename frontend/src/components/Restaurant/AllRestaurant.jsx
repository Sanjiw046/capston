import React from "react";
import { useSelector } from "react-redux";
import Restaurant from "./Restaurant";
import Footer from "./Footer";
import { motion } from "framer-motion";


const AllRestaurant = () => {
    const restaurantData = useSelector(state => state.restaurantReducer);
    const userData = useSelector(state => state.user);
    // console.log("resdata",userData);


    // Category Data Array
    const categories = [
        { name: "Pizza", src: "/categories/pizza.png" },
        { name: "Chicken", src: "/categories/chicken.png" },
        { name: "Fries", src: "/categories/Fries.png" },
        { name: "Maggie", src: "/categories/meggi.png" },
        { name: "Coffee", src: "/categories/coffe.png" },
        { name: "Paneer", src: "/categories/panner.png" },
        { name: "Roll", src: "/categories/roll.png" }
    ];

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat py-10">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md w-full py-6">
                <div className="flex flex-wrap">
                    
                    {/* Left Section - Title, Search, Boxes */}
                    <div className="w-full md:w-3/5 flex flex-col items-center justify-center text-white px-6">
                        <h1 className="text-5xl font-bold">Capston</h1>
                        <h2 className="text-2xl font-semibold mt-2 text-center">Discover restaurants that deliver near you</h2>
                        
                        {/* Search Box */}
                        <div className="flex items-center mt-6">
                            <input 
                                type="search" 
                                className="bg-white opacity-80 w-56 sm:w-80 px-4 py-2 rounded-lg text-black focus:outline-none" 
                                placeholder="Search for Restaurant"
                            />
                            <button className="bg-yellow-500 text-white ml-2 px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                                Search
                            </button>
                        </div>

                        {/* Three Small Boxes */}
                        <div className="mt-2 flex justify-center gap-3">
                            <div className="text-black py-2 bg-[#f8f8f8] px-3 rounded-lg shadow-md flex flex-col items-center w-28">
                                <img className="w-10 h-10" src="routing.svg" alt="Wide Map"/>
                                <h6 className="mt-1 text-xs text-center">Wide Map</h6>
                            </div>
                            <div className="text-black py-2 bg-[#f8f8f8] px-3 rounded-lg shadow-md flex flex-col items-center w-28">
                                <img className="w-10 h-10" src="3d-rotate.svg" alt="Easiest Order"/>
                                <h6 className="mt-1 text-xs text-center">Easiest Order</h6>
                            </div>
                            <div className="text-black py-2 bg-[#f8f8f8] px-3 rounded-lg shadow-md flex flex-col items-center w-28">
                                <img className="w-10 h-10" src="truck.svg" alt="Most Delivery"/>
                                <h6 className="mt-1 text-xs text-center">Most Delivery</h6>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Delivery Image */}
                    <div className="w-full md:w-2/5 flex justify-center items-center">
                        <motion.img 
                            className="w-4/5 max-w-md" 
                            src="home-vector.png" 
                            alt="Delivery"
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 0.8, ease: "easeOut" }} 
                            />
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="mt-4">
                <div className="ml-4 pl-4">
                    <h2 className="text-xl font-semibold">Categories</h2>
                    <h5 className="!text-gray-500">Browse our top categories to discover different cuisines.</h5>
                </div>
                
                {/* Category List */}
                <div className="flex justify-center gap-4 flex-wrap mt-4">
                    {categories.map((category, index) => (
                        <div key={index} 
                            className="text-black py-2 bg-[#f8f8f8] px-3 rounded-lg shadow-md flex flex-col items-center w-24 sm:w-32 
                                       transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:bg-blue-100 
                                       hover:scale-105 active:scale-95 cursor-pointer">
                            <img className="w-20 h-20 transition-transform duration-300 group-hover:rotate-6" src={category.src} alt={category.name} />
                            <h6 className="text-xs text-center mt-1 transition-opacity duration-300 group-hover:opacity-80">{category.name}</h6>
                        </div>
                    ))}
                </div>
            </div>

            {/* Restaurant List Section */}
            <div className="pt-4 mt-4">
                <div className="ml-4 mr-4 pl-4 pr-4">
                    <h2 className="text-xl font-semibold">Popular Restaurants</h2>
                    <h5 className="!text-gray-600">Find nearby popular Restaurants.</h5>
                </div>
                <div className="ml-4 mr-4 px-4 mt-2">
                    <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        {restaurantData.map((restaurant, index) => (
                            <div key={index}>
                                <Restaurant restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* veg Restaurant */}
            <div className="pt-4 mt-4">
                <div className="ml-4 mr-4 pl-4 pr-4">
                    <h2 className="text-xl font-semibold">Pure Veg Restaurants</h2>
                    <h5 className="!text-gray-600">Find nearby popular Veg Restaurants.</h5>
                </div>
                <div className="ml-4 mr-4 px-4 mt-2">
                    <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        {restaurantData
                            .filter((restaurant) => restaurant.resType==="veg") // Only veg restaurants
                            .slice(0, 4) // Show only first 8 veg restaurants
                            .map((restaurant, index) => (
                                <div key={index}>
                                    <Restaurant restaurant={restaurant} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* non-veg restaurant */}
            <div className="pt-4 mt-4">
                <div className="ml-4 mr-4 pl-4 pr-4">
                    <h2 className="text-xl font-semibold">Non-Veg Restaurants</h2>
                    <h5 className="!text-gray-600">Find nearby popular Non-Veg Restaurants.</h5>
                </div>
                <div className="ml-4 mr-4 px-4 mt-2">
                    <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        {restaurantData
                            .filter((restaurant) => restaurant.resType==="nonveg" || restaurant.resType === "mixed") // Only veg restaurants
                            .slice(0, 4) // Show only first 8 veg restaurants
                            .map((restaurant, index) => (
                                <div key={index}>
                                    <Restaurant restaurant={restaurant} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Footer/>
            </div>
        </div>
    );
};

export default AllRestaurant;
