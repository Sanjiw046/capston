import Restaurant from '../models/restaurantsDB.js';
import User from "../models/authDB.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from '../utils/ErrorHandler.js';
import Order from '../models/orderDB.js';
import { compareSync } from 'bcrypt';

export const placeOrder = ErrorWrapper(async (req,res,next)=>{
    const userId = req.user._id;
    // console.log(req.user._id);
    try {
        const user = await User.findById(userId);
        // console.log(user)
        if(!user){
            throw new ErrorHandler(402,"user not found")
        }
        if(user.cart.length===0){
            throw new ErrorHandler(402,"cart is empty");
        }

        // console.log(user.cart[0]);
        // console.log(user.cart[0].restaurantId);
        //group the cart items
        const groupItems = {};
        user.cart.forEach(item=>{
            
            const restaurantId = item.restaurantId.toString();
            // console.log(restaurantId);
            if(!groupItems[restaurantId]){
                groupItems[restaurantId]=[];
            }
            groupItems[restaurantId].push(item);
        })

        const ordersToReturn = [];

        for (const restaurantId in groupItems) {
          const items = groupItems[restaurantId];
          // console.log("items:",items[0].food.foodItem.images[0].url);
      
          // Step 2: Create structured items and calculate total price
          const structuredItems = items.map(item => ({
            food: item.food,
            quantity: item.quantity
          }));
      
          const totalPrice = structuredItems.reduce(
            (acc, curr) => acc + curr.food.foodItem.price * curr.quantity,
            0
          );
        

            // Step 3: Save to Order collection
            const newOrder = await Order.create({
                user: userId,
                restaurant: restaurantId,
                items: structuredItems,
                totalPrice,
                status: 'pending'
            });
    
          ordersToReturn.push(newOrder);
        }
      
        const order = {
            date: new Date(),
            status: 'placed',
            items: user.cart.map(item => ({
              
              name: item.food.foodItem.name,
              price: item.food.foodItem.price,
              image:item.food.foodItem.images[0].url,
              quantity: item.quantity,
              id: item.food._id
            })),
            name: user.name,
            restaurantId: user.cart[0].restaurantId
        };
        user.orderHistory.push(order);
        user.cart = [];
        await user.save();

        res.status(200).json({ 
            message: 'Order placed successfully!',
            order,
            data:user.orderHistory
         });
    
    } 
    catch (error) {
        console.error(error);
        throw new ErrorHandler(500, error.message || "Internal Server Error")
    }
})


export const getOrdersByRestaurant = ErrorWrapper(async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    // Step 1: Validate restaurant existence
    const restaurant = await Restaurant.findOne({ _id: restaurantId });

    if (!restaurant) {
      throw new ErrorHandler(403, "Unauthorized access or restaurant not found");
    }

    // Step 2: Fetch related orders
    const orders = await Order.find({ restaurant: restaurantId })
      .populate('user', 'name email')
      .select('_id user items totalPrice status');

    const formattedOrders = orders.map(order => ({
      orderId: order._id,
      userName: order.user.name,
      items: order.items.map(item => ({
        name: item.food?.foodItem?.name || 'Unnamed Item',
        price: item.food?.foodItem?.price || 0,
        quantity: item.quantity,
        subtotal: (item.food?.foodItem?.price || 0) * item.quantity
      })),
      amount: order.totalPrice,
      status: order.status
    }));

    res.status(200).json({
      success: true,
      formattedOrders,
    });
  } catch (error) {
    throw new ErrorHandler(500, error.message || "Internal Server Error");
  }
});


export const postUpdateStatusOrderDB = ErrorWrapper(async(req,res,next)=>{
  const {orderId} = req.body;
  const {status} = req.body;

  try {
    // const allowedStatuses = ['pending', 'preparing', 'out for delivery', 'delivered'];
    // if(!allowedStatuses.includes(status)){
    //   return new ErrorHandler(403, "Give right status");
    // }
    
    // find the food items
    const order = await Order.findById({
      _id : orderId
    })

    if(!order){
      return new ErrorHandler(400, "Order not found");
    }
    order.status = status;

    await order.save();

    

    res.status(200).json({
      success: true,
      message: "order updated",
      order
    });

  } catch (error) {
    return new ErrorHandler(500, error.message || "Internal Server Error");
  }
})

// export const getStausFromOrderDB = ErrorWrapper(async(req,res,next)=>{
//   const {userId} = req.body;
//   const {status} = req.body;

//   try {
//     const allowedStatuses = ['pending', 'preparing', 'out_for_delivery', 'delivered'];
//     if(!allowedStatuses.includes(status)){
//       return new ErrorHandler(403, "Give right status");
//     }

//     // find the food items
//     const order = await Order.findById({
//       _id : orderId
//     })

//     if(!order){
//       return new ErrorHandler(400, "Order not found");
//     }
//     order.status = status;

//     await order.save();

    

//     res.status(200).json({
//       success: true,
//       message: "order updated",
//       order
//     });

//   } catch (error) {
//     return new ErrorHandler(500, error.message || "Internal Server Error");
//   }
// })