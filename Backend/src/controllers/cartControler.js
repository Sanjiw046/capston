// 


import Restaurant from '../models/restaurantsDB.js';
import User from "../models/authDB.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from '../utils/ErrorHandler.js';

export const getAddCart = ErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    let { restaurant_name, category, quantity } = req.query;
    quantity = +quantity || 1;

    try {
        const restaurant = await Restaurant.findOne({ name: restaurant_name });
        // console.log("res:",restaurant)
        if (!restaurant) throw new ErrorHandler(401, `Restaurant with name ${restaurant_name} does not exist!`);

        const foodItem = await restaurant.getFoodItem(category, id);
        console.log(foodItem.foodItem._id);
        // if (!foodItem || !foodItem._id) throw new ErrorHandler(404, "Food item not found!");

        let cartItem = { food: foodItem, quantity,restaurantId: restaurant._id,restaurantName : restaurant.name};

        const user = await User.findOne({ _id: req.user._id });
        if (!user) throw new ErrorHandler(404, "User not found!");

        // console.log(user.cart);
        // console.log(user.cart[0]);
        
        let existingFoodIndex = user.cart.findIndex(
            (item) => item.food.foodItem._id.toString() === foodItem.foodItem._id.toString()
        );

        // console.log(existingFoodIndex);

        if (existingFoodIndex === -1) {
            user.cart.unshift(cartItem);
        } else {
            user.cart[existingFoodIndex].quantity += quantity;
        }

        await user.save();

        res.status(200).json({
            message: "Requested Food Item added to cart successfully!",
            data: user.cart
        });

    } catch (error) {
        console.log(error); // ✅ Log for debugging
        throw new ErrorHandler(error.statusCode || 500, error.message || "Internal Server Error");
    }
});


export const getCartItems = ErrorWrapper(async (req,res,next)=>{
    try{
        const user = await User.findOne({
            _id: req.user._id
        })
    
        res.status(200).json({
            message: "Cart Items fetched Successfully!",
            data: user.cart,
        });
    }
    catch(error){
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

