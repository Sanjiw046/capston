import { Routes, Route, Navigate } from 'react-router-dom';
import './main.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import RestaurantPage from './pages/RestaurantPage';
import Cart from './pages/Cart';
import AddRestaurant from './pages/AddRestaurant';
import RegisterRestaurant from './pages/RegisterRestaurant';
import { useSelector } from 'react-redux';
import FoodDetails from './pages/FoodDetails';
import AddCuisine from './pages/AddCuisine';
import AddFoodItem from './pages/AddFoodItem';
import UpdateRestaurant from './pages/UpdateRestaurant';
import OrderHistory from './pages/OrderHistory';
import UserProfilePage from './components/Profile/UserProfilePage';
import NotificationListener from './pages/NotificationListener';
import AllOrders from './pages/AllOrders';
import LandingPage from './pages/LandingPage';

// 🟡 Toastify import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProtectRoute({ children }) {
  const userData = useSelector((state) => state.user);
  if (!userData.isLoggedIn || userData.userRole !== 'seller') {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <>
      {/* Notification Socket.IO listener */}
      <NotificationListener />

      {/* ✅ Toast Container (should only be declared once!) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Home />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/app/:restaurantId/orders" element={<AllOrders />} />
        <Route path="/profile" element={<UserProfilePage />} />

        <Route
          path="/register-restaurant"
          element={
            <ProtectRoute>
              <RegisterRestaurant />
            </ProtectRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/app/:restaurant_id" element={<RestaurantPage />} />
        <Route path="/restaurant/:restaurant_id/food/:id" element={<FoodDetails />} />
        <Route
          path="/add-restaurant"
          element={
            <ProtectRoute>
              <AddRestaurant />
            </ProtectRoute>
          }
        />
        <Route path="/add-cuisine" element={<AddCuisine />} />
        <Route path="/add-food-item" element={<AddFoodItem />} />
        <Route path="/register-restaurant/update-restaurant" element={<UpdateRestaurant />} />
      </Routes>
    </>
  );
}

export default App;
