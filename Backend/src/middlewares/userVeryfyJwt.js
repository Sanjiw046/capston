import ErrorWrapper from "../utils/ErrorWrapper.js";
import jwt from 'jsonwebtoken';
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/authDB.js";

//isse index.js se call kar rhe hain
export const userVeryfyJwt = ErrorWrapper(async(req,res,next)=>{
    const incomingRefreshToken = req.cookies.refreshToken;
    const incomingAccessToken = req.cookies.accessToken;
    // console.log('hii');
    if (!incomingRefreshToken || !incomingAccessToken) {
        throw new ErrorHandler(401, "Not authorized to access, kindly login first and try again!");
    }

    try{
        //login karne k bad jo access token save hota hai,usse upar nikala hai aur decode kar rhe hain, decode ho gaya to o user ki information dega, 
        let userInfo = jwt.verify(incomingAccessToken,process.env.ACCESS_TOKEN_KEY);
        // console.log(userInfo.userId);

        const user = await User.findOne({
            _id : userInfo.userId
        })
        if(!user){
            throw new ErrorHandler(error.message);
            
        }
        // console.log(user.refreshToken);
        let userRefreshToken = user.refreshToken;
        if (incomingRefreshToken !== userRefreshToken) {
            throw new ErrorHandler(401, "Not authorized to access, kindly login first and try again!");
        }
        console.log(incomingRefreshToken === userRefreshToken);
        // console.log(incomingRefreshToken);

        //it  is used to attach the authenticated user's information to the req object, userVerifyJwt ko index.js se call kar rahe jab bhi '/restaurant' pe call ja raha taki user ko verify kar paye, jab verify ho jayega to req k body k sath user ko attach kar de rhe taki uska email, name etc access kar paye jo ki database ki query ko kam kar dega.
        req.user = user;
        // console.log(req.user)
        next();
    }
    catch(err){
        console.log(err);
        throw new ErrorHandler(500, "Internal server error while login!");
    }

})