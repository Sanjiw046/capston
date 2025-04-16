import React from "react";
import { motion } from "framer-motion";

const FoodImageCarousel = ({ name, address, imageUrl, contact }) => {
  
    // console.log(imageUrl);
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-64 rounded-lg overflow-hidden shadow-md"
        >
            {/* Background Image */}
            <img
                src={imageUrl}
                alt="Restaurant Cover"
                className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-center items-center text-white text-center">
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-sm">{address}</p>
                <p className="text-sm font-medium">{contact}</p>
            </div>
        </motion.div>
    );
};


export default FoodImageCarousel;