import User from "../models/authDB.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import uploadOnCloudnary from "../utils/CloudnaryUpload.js";
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import axios from "axios";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

//ErrorWrapper ek function hai jisse utils folder me banaye hai, jiske ander hum apne function ko likh rhe hain, agar function koi error aayega to error k according o status code show karega and error ko
export const postSignup = ErrorWrapper(async function (req,res,next) {
        // console.log("Request body:", req.body);
        // console.log("Uploaded file:", req.file); 
        const {username,password,name,email, userRole} = req.body;
        //body k ander jo jo data-fields aa rahi hai usse array k form me store kar liya
        const incommingFields = Object.keys(req.body);
        const requireFields = ['username','password','name','email'];
        //then requireField pe filter function laga k check kar liya ki body kuch missing hai to usse missingField array me daal do
        const missingFields = requireFields.filter((field)=> !incommingFields.includes(field));
        // missingFields me ek bhi field huaa to error show karega
        if(missingFields.length > 0){
            //yaha array ko string me convert kar de rhe hain
            throw new ErrorHandler(401,`There are missing field ${missingFields.join(',')}  while signup`);
        }
        // console.log(req.file);
      
        // check any User is already exist or not
        const existingUser = await User.findOne({
            $or:[
                {username},
                {email}
            ]
        });
        if(existingUser){
            throw new ErrorHandler(401,`User with the username ${username} or email ${email} already exit`);
        }

        // now we upload the image on cloudnary
        let cloudnaryResponce;
        try{
            cloudnaryResponce =await uploadOnCloudnary(req.file.path);
        }
        catch(err){
            throw new ErrorHandler(401,`Error while uploading Image ${err.message}`);
        }
        // console.log('hii after ',cloudnaryResponce);

        // now create the user
        try{
            const user = await User.create({
                username,
                password, //password save hone pahale hash hoga, see user.js-db, where we write a pre-funtion for hashing
                name,
                email,
                image: cloudnaryResponce.secure_url, userRole
            });

            //ye newUser object me password ko chor k baki sare details ko add kar dega, taki jab hum req.status(200).json()... karke data ko show kar rhe hai, tab password na dikhe
            let newUser = await User.findOne({
                _id: user._id
            }).select('-password');

            //agar user create ho jayega to uska details show ho jayega
            res.status(200).json({
                newUser,
                success: true
            })
        }
        catch(err){
            throw new ErrorHandler(500,`Error while creating a new user`);
        }

        // res.send('done');
})




const generateAccessTokenAndRefreshToken = async (userId)=>{
    try{
        let user =await User.findOne({
            _id: userId
        })

        //yaha par jo do function hai usse models k user.js me banaya hai or yaha call kar rhe hai
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        return{
            accessToken,
            refreshToken
        }
    }
    catch(err){
        throw new ErrorHandler(500,'Error while generating the Access token and Refresh token');
    }
}


export const postLogin = ErrorWrapper(async function(req,res,next){
    //abhi email ko lekar issue hai jab bhi dalo tino ka database me jo store hai uske according dalo
    console.log('hii');
    const {username,email,password} = req.body;
    console.log(req.body);
    if(!username && !email){
        throw new ErrorHandler(400,'Please enter new username and email');
    }

    if(!password){
        throw new ErrorHandler(400,'Please enter correct password');
    }
    let user = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    });
    if(!user){
        throw new ErrorHandler(400,'Invalid Username or Email');
    }

    //match the password, with help of the function which i wrote in models/user.js, which return true or false
    const isPasswordMatch =  user.isCorrectPassword(password);
    if(!isPasswordMatch){
        throw new ErrorHandler(400,'Invalid Password');
    }

    //in dono k liye function upar banaya hai
    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
    // console.log(refreshToken);
    
    //models-->user.js me jo refreshToken banaya hai usse update kar diya
    user.refreshToken = refreshToken;

    
    await user.save(); // Ensure this completes before sending response
    
    //user ko show kar kar rhe hain success hone dpar isliye password and refreshtoken ko hata denge
    user = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    }).select('-password -refreshToken');
    //sab thik rha to ye message show hoga
    res.status(200)
        .cookie('refreshToken',refreshToken)
        .cookie('accessToken',accessToken)
        .json({
        success: true,
        message:' Login Successfuly',
        user,
    });

})


//logout
export const postLogout = ErrorWrapper(async function(req,res,next){
    try {
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' });
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'None' }); 

        res.status(200).json({
            message: 'Logged out successfully'
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message || "Internal Server Error");
    }
})


//for find the distance and time WITH GOOGLE CLOUD
export const getDistance = ErrorWrapper(async function(req,res,next){
    try {
        console.log(req.query)
        const { userLat, userLng, restaurantLat, restaurantLng} = req.query;

        if( !userLat || !userLng || !restaurantLat || !restaurantLng){
            throw new ErrorHandler(400,"Missing required parameter");
        }

        const apiKey = process.env.GOOGLE_MAP_API_KEY;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLat},${userLng}&destinations=${restaurantLat},${restaurantLng}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;
        console.log(data);

        res.status(200).json({
            data:data,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(500,"Error to fetch Map distance")
    }
})

//for find the distance and time map box api
export const getDistanceMapBox = ErrorWrapper(async function(req,res,next){
    try {
        console.log(req.query)
        const { userLat, userLng, restaurantLat, restaurantLng} = req.query;

        if( !userLat || !userLng || !restaurantLat || !restaurantLng){
            throw new ErrorHandler(400,"Missing required parameter");
        }

        const apiKey = process.env.MAP_BOX_API_KEY;

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${restaurantLng},${restaurantLat}?access_token=${apiKey}&geometries=geojson`;


        const response = await axios.get(url);
        const data = response.data;
        

        if (data.routes.length === 0) {
            return res.status(404).json({ error: "No route found" });
        }

        const route = data.routes[0];
        const distanceMeters = route.distance; // Distance in meters
        const durationSeconds = route.duration; // Duration in seconds

        res.status(200).json({
            distance_km: (distanceMeters / 1000).toFixed(2), // Convert meters to km
            duration_minutes: (durationSeconds / 60).toFixed(2), // Convert seconds to minutes
            message: "Distance and time fetched successfully",
        })
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(500,"Error to fetch Map distance")
    }
})

// update name
export const updateName = ErrorWrapper(async function(req,res,next){
    const userId = req.user._id;
    const {newName} = req.body;
    // console.log(userId);

    try {
        if(typeof newName !== 'string' || newName.trim() === ''){
            throw new ErrorHandler(400,"Name can not be empty");
        }

        const updatedUser = await User.findOne({
            _id: userId,
            // name:newName
        })
        
        
        if(!updatedUser){
            throw new ErrorHandler(403,"User not found");
        }
        updatedUser.name = newName;
        await updatedUser.save();
        // console.log(updatedUser);
        res.status(200).json({
            message:"Name update successfully",
            updateName:updatedUser.name
        })
        
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


// update profile image
export const updateProfileImage = ErrorWrapper(async function(req,res,next){
    const userId = req.user._id;
    
    // console.log(userId);

    try {

        const curUser = await User.findOne({
            _id: userId,
            // name:newName
        })
        
        
        if(!curUser){
            throw new ErrorHandler(403,"User not found");
        }
        if(!req.file){
            throw new ErrorHandler(404,"please upload image file");
        }

        if(req.file){
            const cloudnaryResponce = await uploadOnCloudnary(req.file.path);
            console.log(cloudnaryResponce);
            const url = cloudnaryResponce.secure_url;
            curUser.image = url;
        }
        await curUser.save();
        // console.log(curUser);
        res.status(200).json({
            message:"Profile Image update successfully",
        })
        
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

// Set up Nodemailer transporter (you can use Gmail, SMTP, etc.) APNE gmail se otp bhejne k liye
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL, // your email
      pass: process.env.APP_PASSWORD,   // your email password
    },
  });


  // Store OTPs in memory (or use a database for production)
  let otpStorage = {};  // Format: { email: otp }


// update email
// Backend Code: Email OTP Request (POST
export const updateEmailOtpReq = ErrorWrapper(async function(req,res,next){
    const { email } = req.body;
    
    try {
        // Check if email exists in database
        const user = await User.findOne({ email });
        if (user) {
        return res.status(400).json({ message: 'This email is already in use.' });
        }

        // Generate a random OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
        otpStorage[email] = otp;

        // Send OTP email
        const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'OTP Verification for Email Change',
        text: `Your OTP is: ${otp}`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error sending OTP email.' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent successfully.' });
        });

            
    } 
    catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


//OTP Verification (POST /update/verifyEmailOTP)
export const updateEmailOtpverify = ErrorWrapper(async function(req,res,next){
    const { email, otp } = req.body;
    const userId = req.user._id;
    // console.log(userId);
    try {
        // Check if OTP is valid
        if (otpStorage[email] !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Find the user in the database and update the email
        const user = await User.findOne({ 
            _id: userId
        });
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Update the email
        user.email = email;
        await user.save();

        // Clear the OTP storage (since it's no longer needed)
        delete otpStorage[email];

        res.status(200).json({ message: 'Email updated successfully.' });

    }
    catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

//order status update
export const postUpdateStatusUserDB = ErrorWrapper(async(req,res,next)=>{
  const userId = req.user._id;
  const {status} = req.body;

  console.log(status);
  try {
    const allowedStatuses = ['placed', 'preparing', 'out for delivery', 'delivered'];

    if(!allowedStatuses.includes(status)){
      return next(new ErrorHandler(403, "Give right status"));
    }

    // find the food items
    const user = await User.findById({
      _id : userId
    })
    // console.log(user)
    if(!user){
      return new ErrorHandler(400, "user not found");
    }

    let curOrder = user.orderHistory.length;
    // console.log(curOrder);
    user.orderHistory[curOrder-1].status = status;
    console.log(user.orderHistory[curOrder-1])
    await user.save();

    res.status(200).json({
      success: true,
      message: "order updated",
    });

  } catch (error) {
    return new ErrorHandler(500, error.message || "Internal Server Error");
  }
})