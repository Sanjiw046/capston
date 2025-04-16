import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import RestaurantPageItem from "./RestaurantPage_Item";
import MySpinner from "../components/Spinner";
import { useSelector } from "react-redux";

const RestaurantPage = () => {
    const { restaurant_id } = useParams();
    const [isRestaurantFetched, setIsRestaurantFetched] = useState(false);
    const [restaurant, setRestaurant] = useState(null);
    const userData = useSelector((state)=> state.user);

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const { data } = await axios.get(`/restaurant/${restaurant_id}`);
                setRestaurant(data.restaurant[0]);
                setIsRestaurantFetched(true);
            } catch (error) {
                alert("Error fetching restaurant data");
            }
        };
        getRestaurant();
    }, [restaurant_id]);

    return (
        <div 
            className="padding-fix min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/add-restaurantBg.jpg')` }}
        >
            {isRestaurantFetched ? (
                <RestaurantPageItem restaurant={restaurant} />
            ): (
                <MySpinner />
            )}
        </div>
    );
    
};

export default RestaurantPage;
