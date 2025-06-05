import Restaurant from '../models/restaurantsDB.js';
import User from "../models/authDB.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from '../utils/ErrorHandler.js';
import Order from '../models/orderDB.js';
import { compareSync } from 'bcrypt';
import { razorpay } from '../../config/razorpay_config.js';
import crypto from 'crypto';

export const placeOrder = ErrorWrapper(async (req,res,next)=>{
    const userId = req.user._id;
    // console.log('for place order:',req.user._id);
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

     //filter the user that we can remove user,if he/she not present or their data changed 
    const validOrders = orders.filter(order => order.user !== null);

    const formattedOrders = validOrders.map(order => ({
      orderId: order._id,
      userName: order.user.name || 'user not avilable',
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

export const getCreatePaymentOrder = ErrorWrapper(async(req,res,next)=>{
  const userId = req.user._id;  
  try {
    
    const user = await User.findById({
      _id: userId
    })
    if(!user){
      return new ErrorHandler(403, "user not found, kindly login first");
    }

    // find the food items
    const cart = user.cart;
    if(cart.length==0){
      return new ErrorHandler(404,'No food avialable for order');
    }

    const restaurantMap = new Map();

    for(const item of cart){
      // console.log(item);
      const resid = item.restaurantId.toString();
      if(!restaurantMap.has(resid)){
        restaurantMap.set(resid,{
          restaurantId: resid,
          restaurantName: item.restaurantName,
          item: [],
          total:0
        })
      }

        //calculate the price of the particular item of a restaurant
        const price = item.food.foodItem.price * item.quantity;

        //find the restaurant if exist in the restaurant map
        const restaurant = restaurantMap.get(resid);

        //current food details ko uss resmap k res me push kar diya 
        restaurant.item.push(item);

        restaurant.total += price;

      }
    

    // For each restaurant group: we build a Razorpay order with the total price (converted to paise).
    const paymentOrders = [];
    for(const [restaurantId,group] of restaurantMap){
      const options = {
        amount: group.total * 100,
        currency : 'INR',
        receipt: `rcpt_${restaurantId.slice(0, 8)}_${Date.now()}`
      }
      // console.log(options);
      let order;
      try {
        order = await razorpay.orders.create(options);
      } catch (err) {
        console.error("❌ Razorpay order creation failed:", err);
        return next(new ErrorHandler(500, "Razorpay order creation failed"));
      }
      // console.log(order);

      // we store the result in a new array to send back to the frontend.
      paymentOrders.push({
        restaurantId,
        restaurantName: group.restaurantName,
        amount: group.total,
        razorpayOrder: order,
      });

    }
    // console.log(paymentOrders);

    res.status(200).json({
      success: true,
      message: "razorpay payment order created  successfully",
      paymentOrders
    });

  } catch (error) {
    return new ErrorHandler(500, error.message || "Internal Server Error");
  }
});




// for virify the payment with the help of the signature
export const postVerifyPayment = ErrorWrapper(async(req,res,next)=>{

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorHandler(400, "Missing payment details in request body"));
  }

   // Generate expected signature using Razorpay secret
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRECT)
    .update(body.toString())
    .digest('hex');


    // Compare signatures
  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorHandler(400, "Invalid signature, payment verification failed"));
  }
  res.status(200).json({
    success:true,
    message: 'payment verified successfully',
  })
})