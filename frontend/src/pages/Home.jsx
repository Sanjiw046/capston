import axios from '../utils/axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AllRestaurant from '../components/Restaurant/AllRestaurant';
import LandingPage from './LandingPage';
import IsSellerPage from './IsSellerPage';


const Home = () => {
    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isRestaurantFetched, setIsRestaurantFetched] = useState(false);

    useEffect(() => {
        async function getRestaurantDetails() {
            try {
                let { data } = await axios.get('/restaurant/all');
                dispatch({ type: 'SET_RESTAURANTS', payload: data.restaurant });
                setIsRestaurantFetched(true);
            } catch (error) {
                alert(error);
            }
        }
        getRestaurantDetails();
    }, [dispatch]);

    return (
        <div className="padding-fix min-h-screen bg-gray-100">
            {userData.isLoggedIn ? (
                userData.userRole === 'seller' ? (
                    isRestaurantFetched && <IsSellerPage /> // Show the seller page if the user is a seller
                ) : (
                    isRestaurantFetched && <AllRestaurant />
                )
            ) : (
                <LandingPage />
            )}
        </div>
    );
};

export default Home;
