import express from 'express';
const app = express();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const PORT = process.env.PORT;
import userRouter from './router/userRoute.js'
import path from 'path';
import restaurantRouter from './router/restaurantRouter.js'
import {userVeryfyJwt} from './middlewares/userVeryfyJwt.js';
import http from 'http';  // Import http to create the server
import {Server} from 'socket.io';  // Import Socket.IO
import Order from './models/orderDB.js';


const server = http.createServer(app);  // Create an HTTP server with Express

//socket io ko frontend se connect karne k liye
const io = new Server(server,{
  cors:{
    origin : process.env.CORS_ORIGIN,
    credentials: true
  }
});  // Initialize Socket.IO with the server

//If your frontend (e.g., http://localhost:3000) needs to interact with a backend (e.g., http://localhost:5000), CORS allows this interaction.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//Parses incoming JSON payloads in requests and limits their size to 4kb.
app.use(bodyParser.json({limit:'10mb'}));

//Purpose: Parses incoming URL-encoded form data (e.g., from HTML forms) and limits its size to 4kb.
//To handle form submissions (application/x-www-form-urlencoded data).
app.use(bodyParser.urlencoded({extended:true,limit:'10mb'}));
//Serves static files (like HTML, CSS, JavaScript, images) from the public directory.
app.use(express.static('public'));

app.use(cookieParser());


app.use('/',userRouter); //router folder ko import marr rakha hai userRouter name se

//ye check karega agar login hai to data bhej dega nhi to undefinded dega
const getUser = (req,res,next)=>{
    const user = req.user;
    if (!user) {
        return res.status(401).json({ user: undefined });
    }
    return res.status(200).json({ user });
}
app.get('/getuser', userVeryfyJwt, getUser);

// /restaurant pe kuch karne se pahale user ko verigy karna jruri hai, isliye userverifyJwt middleware ka use kar rhe hain, jo ki hume banaya hai
app.use('/restaurant',userVeryfyJwt,restaurantRouter);

mongoose.connect(`${process.env.DB_PATH}/${process.env.DB_NAME}`)
.then(()=>{
    console.log('connect successfully');
    server.listen(PORT,()=>{
        console.log(`http://localhost:`+PORT);
    })
})
.catch(err=>{
    console.log(err);
})


// Socket.IO setup
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // Handle joining a restaurant-specific room
  socket.on('joinRestaurantRoom', (restaurantId) => {
    const roomName = `restaurant_${restaurantId}`;
    socket.join(roomName);
    // console.log(`📦 Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('joinUserRoom', (userId) => {
    const roomName = `user_${userId}`;
    socket.join(roomName);
    // console.log(`📦 Socket ${socket.id} joined user room: ${roomName}`);
  });

 

  // Handle new order placement from the user side
  socket.on('newOrderPlaced', (order) => {
    const restaurantId = order.restaurantId;  // assuming order.restaurant = restaurantId
    const roomName = `restaurant_${restaurantId}`;
    // console.log("📥 New order received for:", roomName);

    // Emit only to the restaurant room
    io.to(roomName).emit('newOrderPlaced', order);
  });

  // Handle order status updates from the seller
  socket.on('orderStatusUpdate', async ({orderId, status}) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      // console.log('updated order:',updatedOrder);

      if (updatedOrder) {
        const restaurantId = updatedOrder.restaurant;
        const roomName = `restaurant_${restaurantId}`;

        // Emit the updated order status to the restaurant room
        // ye backend hai, jab restaurant status update karega
        io.to(roomName).emit('orderUpdated', updatedOrder);
        // console.log(`📤 Order ${orderId} status updated in room ${roomName}`);

        // Emit the updated order status to the user room
        // ye backend hai, jab restaurant status update karne k bad user ka staus update hoga
        const userId = updatedOrder.user.toString();
        const userRoom = `user_${userId}`;
        // console.log(`📤 Emitting orderStatusUpdate to user room: ${userRoom}`, { orderId, status });
        io.to(userRoom).emit('orderStatusUpdate',{
          orderId,
          status,
        })
      }
    } catch (err) {
      console.error('❌ Error updating order:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❎ User disconnected:', socket.id);
  });
});
