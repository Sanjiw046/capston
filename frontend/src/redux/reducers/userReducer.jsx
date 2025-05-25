//yaha action k baad aana hai
//yaha par hum ek function banate aur do chizo ko pass karte hai,
//1. state 
//2. action
//yaha se root reducer me chale jana

import { act } from "react";

//initial state
// initial state
const initialState = {
    _id: '',
    name: '',
    email: '',
    username: '',
    image: '',
    orderHistory: [],
    cart: [],
    isLoggedIn: false,
    userRole: '',
    lat: null,   // <-- added latitude
    lng: null    // <-- added longitude
}

function userReducer(state = initialState, action) {
    switch(action.type) {
        case 'SET_USER':
            return {
                ...state,
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                username: action.payload.username,
                image: action.payload.image,
                orderHistory: action.payload.orderHistory,
                cart: action.payload.cart,
                isLoggedIn: true,
                userRole: action.payload.userRole,
                lat: action.payload.lat || null,
                lng: action.payload.lng || null
            }

        case 'GET_USER':
            return state;

        case 'LOGOUT_USER': 
            return { ...initialState };

        case 'CLEAR_CART':
            return {
                ...state,
                cart: [],
            };

        case 'ADD_ORDER_TO_HISTORY':
            return {
                ...state,
                orderHistory: [...state.orderHistory, action.payload],
            };
            
        case 'SET_CART':
                return {
                    ...state,
                    cart: action.payload,
                };  
                
        case 'UPDATE_NAME':
            return {
                ...state,
                name: action.payload,
            };
            
        case 'UPDATE_EMAIL':
            return {
                ...state,
                email: action.payload,
            };

            case 'UPDATE_IMAGE':
                return {
                  ...state,
                  image: action.payload,
                  isImageUpdating: false,
                };
          
            case 'SET_IMAGE_UPDATING':
                return {
                  ...state,
                  isImageUpdating: action.payload,
                };

        default:
            return state;
    }
}


export default userReducer;
