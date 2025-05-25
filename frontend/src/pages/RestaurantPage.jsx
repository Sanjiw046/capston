import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import RestaurantPageItem from "./RestaurantPage_Item";
import MySpinner from "../components/Spinner";
import { useSelector } from "react-redux";
import socket from "../utils/socket";
import NotificationListener from "./NotificationListener";
import { toast } from "react-toastify";

const RestaurantPage = () => {
    const { restaurant_id } = useParams();  // Restaurant ID from URL
    const [isRestaurantFetched, setIsRestaurantFetched] = useState(false);
    const [restaurant, setRestaurant] = useState(null);
    const userData = useSelector((state) => state.user);

    useEffect(() => {
        // Fetch restaurant data
        const getRestaurant = async () => {
            try {
                const { data } = await axios.get(`/restaurant/${restaurant_id}`);
                setRestaurant(data.restaurant[0]);
                setIsRestaurantFetched(true);
            } catch (error) {
                toast.error("Error fetching restaurant data");
            }
        };

        getRestaurant();

        // Only emit if the user is a seller
        if (userData.isLoggedIn && userData.userRole === "seller" && restaurant_id) {
            socket.emit("joinRestaurantRoom", restaurant_id);
            console.log(`🔗 Seller joined restaurant room: ${restaurant_id}`);
        }

    }, [restaurant_id, userData.isLoggedIn, userData.userRole]);

    return (
        <div
            className="padding-fix min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/add-restaurantBg.jpg')` }}
        >
            {isRestaurantFetched ? (
                <>
                    <NotificationListener/>
                    <RestaurantPageItem restaurant={restaurant} />
                </>
                
            ) : (
                <MySpinner />
            )}
        </div>
    );
};

export default RestaurantPage;
