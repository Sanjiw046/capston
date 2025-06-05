import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    OrderHistory : [],
    id : null
}

const userSlice = createSlice({
    name : user,
    initialState,
    reducers: {
        serUserData : (state,action)=>{
            return {...state,...action.payload}
        }
    },
    updatedOrderStatus : (state,action)=>{
        const {orderId,status} = action.payload;
        // const orderToUpdate = state.OrderHistory.

    }
})