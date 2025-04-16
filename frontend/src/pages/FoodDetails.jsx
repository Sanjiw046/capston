import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { motion } from 'framer-motion';

const FoodDetails = () => {
    const { id, restaurant_id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const restaurantName = searchParams.get("restaurant_name");

    const [food, setFood] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewMessage, setReviewMessage] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const { data } = await axios.get(`/restaurant/get-food-item/${id}?restaurant_name=${restaurantName}&category=${category}`);
                setFood(data.data);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(`/restaurant/get-food-reviews/${restaurant_id}/${id}`);
                setReviews(data.reviews);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };

        fetchFoodDetails();
        fetchReviews();
    }, [id, category, restaurantName, restaurant_id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/restaurant/${restaurant_id}/${id}/add-review`, {
                rating,
                message: reviewMessage,
            });
            setReviews(data.reviews);
            setReviewMessage("");
            setRating(5);
        } catch (err) {
            console.error("Failed to submit review", err);
        }
    };

    if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

    return (
        <div className='padding-fix'>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl p-6">
                    <div></div><br/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-200">
                        {/* Left Side: Food Details */}
                        <div className='bg-gray-200'>
                            <motion.img 
                                src={food?.images[0]?.url} 
                                alt={food?.name} 
                                className="w-100 h-40 ml-2 object-cover rounded-lg shadow-md mt-6"
                                whileHover={{ scale: 1.05 }}
                            />
                            <div className='ml-2'>
                                <h1 className="text-2xl font-bold text-gray-900 mt-2 capitalize">{food?.name}</h1>
                                <p className="text-gray-600 text-sm">{food?.description}</p>
                                <span className="text-xl font-bold text-green-600 block mt-2">₹{food?.price}</span>
                                <p className="text-gray-500 text-sm mt-1">🍽 <strong>Restaurant:</strong> {restaurantName}</p>
                                <p className="text-gray-500 text-sm">📌 <strong>Category:</strong> {category}</p>
                            </div>
                        
                            {/* Review Form */}
                            <form onSubmit={handleReviewSubmit} className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold">Leave a Review</h3>
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)} 
                                    className="block w-full p-2 border rounded mt-2"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} Stars</option>
                                    ))}
                                </select>
                                <textarea 
                                    value={reviewMessage} 
                                    onChange={(e) => setReviewMessage(e.target.value)}
                                    placeholder="Write your review..."
                                    className="block w-full p-2 border rounded mt-2"
                                    rows="3"
                                ></textarea>
                                <button 
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-2 w-full"
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>
                        
                        {/* Right Side: Reviews */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={index} className=" rounded-lg shadow-md">
                                            <div className='bg-gray-200'>
                                                <span className="font-semibold text-gray-800 ml-2 mr-2">{review.username}</span>
                                                <span className="text-yellow-500">⭐ {review.rating}</span>
                                                <p className="text-gray-600 ml-2">{review.message}</p>
                                            </div>
                                        </div>
                                        
                                    ))
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;
