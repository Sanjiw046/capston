import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImage from "./Profile/ProfileImage";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const { data } = await axios.get("/getUser");
        if (data.user) {
          dispatch({ type: "SET_USER", payload: data.user });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };
    
    isLoggedIn();
  }, [dispatch]);

  const logoutHandler = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });

      dispatch({ type: "LOGOUT_USER" });
      
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">

        {/* Logo */}
        <div className="text-white text-2xl font-bold">🍽️ Capston</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-x-6 text-white font-medium">
          {!userData.isLoggedIn && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          )}
          {!userData.isLoggedIn && (
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Signup
            </NavLink>
          )}
          

          {/* {userData.isLoggedIn && userData.userRole === "seller" && (
            <NavLink
              to="/app/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

          )} */} 


          {userData.isLoggedIn && (
            <NavLink
              to="/app"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

          )}
          {userData.isLoggedIn && userData.userRole === "buyer" && (
            <NavLink
              to="/app/cart"
              className={({ isActive }) =>
                `relative nav-link transition-colors duration-300 ${
                  isActive ? "active" : ""
                }`
              }
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-block text-lg"
              >
                <FaShoppingCart />
              </motion.div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: userData?.cart?.length > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {userData?.cart?.length || 0}
              </motion.span>
            </NavLink>
          )}

          {userData.isLoggedIn && userData.userRole === "seller" && (
            <NavLink
              to="/register-restaurant"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Register Restaurant
            </NavLink>
          )}

          {userData.isLoggedIn && userData.userRole === "buyer" &&(
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              History
            </NavLink>
          )}
          
          {userData.isLoggedIn && (
            <button
              onClick={logoutHandler}
              className="nav-link logout-btn"
            >
              Logout
            </button>
          )}

          {userData.isLoggedIn && <ProfileImage imageUrl={userData.image} />}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden text-white text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-indigo-800 md:hidden flex flex-col items-center py-4 space-y-4 text-white font-medium"
          >
            {!userData.isLoggedIn && (
              <NavLink
                to="/login"
                className="text-white transition-colors duration-200 hover:text-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
            {!userData.isLoggedIn && (
              <NavLink
                to="/signup"
                className="text-white transition-colors duration-200 hover:text-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </NavLink>
            )}
            {userData.isLoggedIn && (
              <NavLink
                to="/app"
                className="text-white transition-colors duration-200 hover:text-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            )}
            {userData.isLoggedIn && (
              <NavLink
                to="/cart"
                className="relative text-white transition-colors duration-200 hover:text-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                <FaShoppingCart className="inline-block text-lg" />
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {userData?.cart?.length || 0}
                </span>
              </NavLink>
            )}
            {userData.isLoggedIn && userData.userRole === "seller" && (
              <NavLink
                to="/register-restaurant"
                className="text-white transition-colors duration-200 hover:text-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                Register Restaurant
              </NavLink>
            )}
            {userData.isLoggedIn && (
              <NavLink
                to="/history"
                className="text-white transition-colors duration-200 hover:text-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                History
              </NavLink>
            )}
            {userData.isLoggedIn && (
              <button
                onClick={logoutHandler}
                className="text-white transition-colors duration-200 hover:text-yellow-300"
              >
                Logout
              </button>
            )}
            {userData.isLoggedIn && <ProfileImage imageUrl={userData.image} />}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
