import { Routes,Route, Navigate } from 'react-router-dom'
import './main.css'
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import RestaurantPage from './pages/RestaurantPage';
import Cart from './pages/Cart'
import AddRestaurant from './pages/AddRestaurant';
import RegisterRestaurant from './pages/RegisterRestaurant';
import { useSelector } from 'react-redux';
import FoodDetails from './pages/FoodDetails';
import AddCuisine from './pages/AddCuisine';
import AddFoodItem from './pages/AddFoodItem';
import UpdateRestaurant from './pages/UpdateRestaurant';
import OrderHistory from './pages/OrderHistory';
import UserProfilePage from './components/Profile/UserProfilePage';

function ProtectRoute({children}){
  const userData = useSelector((state)=> state.user);
  if(!userData.isLoggedIn || userData.userRole !== 'seller'){
    return <Navigate to ='/login'/>
  }
  return children;
}
function App() {
  
  return (
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/app' element={<Home/>}/>
      <Route path='/history' element={<OrderHistory/>}/>
      <Route path ='/profile' element={<UserProfilePage/>}/>
      
      <Route path='/register-restaurant' element={
        <ProtectRoute>
          <RegisterRestaurant/>
        </ProtectRoute>
      }/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/app/:restaurant_id' element={<RestaurantPage />}/>
      <Route path="/restaurant/:restaurant_id/food/:id" element={<FoodDetails />} />
      <Route path='/add-restaurant' element={
        <ProtectRoute>
          <AddRestaurant/>
        </ProtectRoute>
      }/>
      <Route path="/add-cuisine" element={<AddCuisine />} />
      <Route path = "/add-food-item" element ={<AddFoodItem/>}/>
      <Route path = "/register-restaurant/update-restaurant" element ={<UpdateRestaurant/>}/>
    </Routes>
  )
}

export default App
