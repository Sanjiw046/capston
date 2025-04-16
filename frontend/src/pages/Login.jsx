import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useDispatch } from 'react-redux';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        const username = event.target[0].value.trim();
        const password = event.target[1].value.trim();
    
        if (!username || !password) {
            alert("Please fill in both fields");
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post('/login', { username, password });
    
            // Get geolocation
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    //sve the lat and lng in localstorage
                    localStorage.setItem("userLat", lat);
                    localStorage.setItem("userLng", lng);
    
                    dispatch({
                        type: 'SET_USER',
                        payload: {
                            ...response.data.user,
                            lat,
                            lng
                        }
                    });
    
                    alert("Login successful with location!");
                    navigate('/app');
                },
                (error) => {
                    console.warn("Location access denied or error:", error);

                    // ⛔ Optional: Clear previous location
                    localStorage.removeItem("userLat");
                    localStorage.removeItem("userLng");
    
                    // Dispatch without location if access denied
                    dispatch({
                        type: 'SET_USER',
                        payload: {
                            ...response.data.user
                        }
                    });
    
                    alert("Login successful (location not shared).");
                    navigate('/app');
                }
            );
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('/backgroud-signup.jpg')" }}></div>

            <motion.div 
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="bg-white opacity-75 ml-auto mr-4 p-6 rounded-2xl shadow-xl z-10 w-[50%] text-center relative h-[45%]"
            >
                <h1 className="text-3xl mt-4 font-bold text-blue-600">Welcome Back!</h1>
                <p className="text-[#198754] font-semibold mb-6">Login to continue</p>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <input 
                        type="text" placeholder="Username or Email" required 
                        className="w-[90%] p-3 border border-gray-700 mb-1 rounded-lg focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" 
                    />
                    <input 
                        type="password" placeholder="Password" required 
                        className="w-[90%] p-3 border border-gray-700 mb-1 rounded-lg focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" 
                    />
                    <button type="submit" disabled={loading} 
                        className="w-[80%] bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-gray-600">
                    Don't have an account? <a href="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</a>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
