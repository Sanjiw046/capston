
import express from 'express'
const router = express.Router();
import upload from '../utils/multer.js';

import {postSignup,
    postLogin,
    postLogout,
    getDistance,
    getDistanceMapBox,
    updateName,
    updateEmailOtpReq,
    updateEmailOtpverify,
    updateProfileImage,
    postUpdateStatusUserDB
     } from '../controllers/authController.js';
import { userVeryfyJwt } from '../middlewares/userVeryfyJwt.js';

//upload.single('image')  iska use hum single file ko upload karne me karte hai, image isliye kyuki db me bhi same name hai, jab postman se data k sath image bhejte hai to form kthrough bhejte hain, image ko upload karne k liye type ko text se hatakar file karna, form-data se sare req bhejna
router.post('/signup', upload.single('image'), postSignup);

router.post('/login',postLogin);

router.post('/logout',postLogout);

//google cloud se fine kar rhe hain tab
router.get('/api/distance',getDistance);

//map box api k liye
router.get('/api/distanceMapbox',getDistanceMapBox);

//update user name
router.post('/update/updateName',userVeryfyJwt,updateName);

// update profile image
router.post('/update/updateProfileImage',upload.single('image'),userVeryfyJwt,updateProfileImage);

//update user mail req otp
router.post('/update/requestEmailOTP',updateEmailOtpReq);

//update user mail req otp
router.post('/update/verifyEmailOTP',userVeryfyJwt,updateEmailOtpverify);

//updater order status
router.post('/update/order-status',userVeryfyJwt,postUpdateStatusUserDB);

export default router;