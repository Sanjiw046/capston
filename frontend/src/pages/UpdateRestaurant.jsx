import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import UpdateCoverImage from "../components/UpdateCoverImage";
import UpdateName from "../components/UpdateName"; // ✅ Import UpdateName component
import UpdateContact from "../components/UpdateContact";

const UpdateRestaurant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get("restaurant");

  const [showUpdateCover, setShowUpdateCover] = useState(false);
  const [showUpdateName, setShowUpdateName] = useState(false); // ✅ State to track UpdateName visibility
  const [showUpdateContact, setShowUpdateContact] = useState(false);

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/update-restaurantBg.jpg')" }}
    >
      {showUpdateCover ? ( 
        <UpdateCoverImage restaurantName={restaurantName} />
      ) : showUpdateName ? ( 
        <UpdateName restaurantName={restaurantName} /> // ✅ Show UpdateName Component
      ) : showUpdateContact ? (
        <UpdateContact restaurantName = {restaurantName}/>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }} 
          className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-lg"
        >
          <h2 className="text-4xl md:text-5xl pt-3 pb-3 font-extrabold text-center mb-6 text-gray-800">
            🔄 Update Restaurant 🔄
          </h2>

          <div className="space-y-4">
            {/* Update Cover Image */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full text-white py-2 rounded-md font-bold bg-blue-500 hover:bg-blue-600 transition-all"
              onClick={() => setShowUpdateCover(true)}
            >
              🖼️ Update Cover Image
            </motion.button>

            {/* Update Name */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full text-white py-2 rounded-md font-bold bg-orange-500 hover:bg-orange-600 transition-all"
              onClick={() => setShowUpdateName(true)} // ✅ Toggle UpdateName visibility
            >
              ✏️ Update Name
            </motion.button>

            {/* Update Contact Details */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full text-white py-2 rounded-md font-bold bg-pink-500 hover:bg-orange-600 transition-all"
              onClick={() => setShowUpdateContact(true)}
            >
              📞 Update Contact Details
            </motion.button>

            {/* Add Cuisines */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full text-white py-2 rounded-md font-bold bg-green-500 hover:bg-green-600 transition-all"
              onClick={() => navigate(`/add-cuisine?restaurant=${encodeURIComponent(restaurantName)}`)}
            >
              🍛 Add Cuisines
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UpdateRestaurant;
