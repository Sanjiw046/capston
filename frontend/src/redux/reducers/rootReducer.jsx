


// yaha par hum sare reducer ko combine kar rahe hain, taki bas iske use se sare reducer ko use kar sake
//sabhi ko object k form dall rahe hain

import  userReducer  from "./userReducer";
import restaurantReducer from "./restaurantReducer"
import { combineReducers } from "redux";
import distanceReducer from "../Slices/distanceSlice"
// iske baad hum store.js me in sab ko store kar denge
const rootReducer = combineReducers({
    user: userReducer,
    restaurantReducer,
    distanceReducer
})

export default rootReducer;