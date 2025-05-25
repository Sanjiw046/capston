import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from "../utils/axios"; // Importing the Axios instance
import { toast } from 'react-toastify';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", event.target[0].value);
        formData.append("email", event.target[1].value);
        formData.append("username", event.target[2].value);
        formData.append("password", event.target[3].value);
        formData.append("userRole", event.target[4].value);
        formData.append("image", event.target[5].files[0]); // File upload

        try {
            const response = await axios.post("/signup", formData, 
                {
                    headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Signup successful!");
            navigate("/login");
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An error occurred during signup.");
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
                className="bg-white ml-auto mr-4 p-4 rounded-2xl shadow-xl z-10 w-[50%] text-center relative h-[50%]"
            >
                <h1 className="text-3xl font-bold text-red-600">Welcome to Capston</h1>
                <p className="text-[#198754] font-semibold mb-6">Delicious experiences await you!</p>
                
                <form onSubmit={handleSignup} className="space-y-5">
                    <input type="text" placeholder="Name" required className="w-full p-2 mb-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400" />
                    <input type="email" placeholder="Email" required className="w-full p-2 mb-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400" />
                    <input type="text" placeholder="Username" required className="w-full p-2 mb-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400" />
                    <input type="password" placeholder="Password" required className="w-full p-2 mb-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400" />
                    <select required className="w-full p-2 mb-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400">
                        <option value="">Select Role</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                    <input type="file" accept="image/*" className="w-full p-2 mb-1 border border-gray-300 rounded-lg" />
                    <button type="submit" disabled={loading} 
                        className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 disabled:opacity-50">
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
