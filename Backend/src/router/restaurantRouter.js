import express from 'express';
import { postRegisterRestaurant,
    postCusineCategoryAdd,
    postAddFoodItems,
    postUpdateFoodItem, 
    getDeleteFoodItem, 
    getFoodItems, 
    getFoodItem, 
    getAllCusines,
    postAddFoodImages,
    getRestaurants,
    getRestaurant,
    getMyRestaurants,
    postUpdateCoverImage,
    getRestaurantByName,
    getRestaurnatFoodName,} from '../controllers/restaurantController.js';

import { postUpdateName,
    postUpdateResContactNumber} from '../controllers/restaurantController.js';    

import { postAddReview,
            postUpdateReview,
            getDeleteReview,
            getAllReviews,
        getReview,
        getFoodReviews,
        postAddFoodReview } from '../controllers/restaurantController.js';


    import {
        getAddCart,
        // getCartItemDelete,
        // getCartItemIncrease,
        // getCartItemDecrease,
        getCartItems,
       
    } from "../controllers/cartControler.js";   

    import {placeOrder,
        getOrdersByRestaurant, 
        postUpdateStatusOrderDB, 
    } from '../controllers/orderControler.js';

const router = express.Router();
import upload from '../utils/multer.js';


//sabse pahale upload single chalega jo image hum bhej rhe hai usse hamare local system me upload kar dega, yaha par wahi name hona chahiye jo req bhejte wakt as image key use kar rhe hain, uske bad postRestaurant chalega, 
router.post('/register', upload.single('coverImage'), postRegisterRestaurant);

router.post('/cusines-category-add',postCusineCategoryAdd);

router.post('/add-food-items',upload.single('image'),postAddFoodItems);


router.post('/update-food-item/:id',upload.single('image'),postUpdateFoodItem);

router.post('/update-coverImage',upload.single('coverImage'),postUpdateCoverImage)

router.post('/update-name',postUpdateName);

router.post('/update-number',postUpdateResContactNumber);

router.get('/delete-food-item/:id',getDeleteFoodItem);

router.get('/get-food-items',getFoodItems);

router.get('/get-food-item/:id',getFoodItem);

router.get('/get-all-cusines',getAllCusines);

//upload.array() ek multer middleware hai jo muliple image ko upload karne ke help karta hai, 
router.post('/add-food-images/:id',upload.array('images',6), postAddFoodImages);

router.get('/all',getRestaurants);

router.get('/getReataurantByname',getRestaurantByName);

router.get('/get-my-restaurants',getMyRestaurants);





//CRUD routes for Reviews
router.get('/get-all-reviews', getAllReviews);

router.post('/add-review', upload.array('images', 12), postAddReview);

router.post("/:restaurantId/:foodId/add-review",postAddFoodReview);

router.get('/get-food-reviews/:restaurantId/:foodId', getFoodReviews);

router.post('/update-review/:reviewId', postUpdateReview);

router.get('/delete-review/:reviewId', getDeleteReview);

router.get('/get-review/:reviewId', getReview);
// router.get('/all', getRestaurants);


//crud operation on cart;
router.get("/view-cart", getCartItems);
router.get("/add-cart/:id", getAddCart);
router.post("/cart/place-order",placeOrder);



router.get('/app/orders/:restaurantId',getOrdersByRestaurant);
router.post("/app/orders/:restaurantId/updateStatus",postUpdateStatusOrderDB)
router.get("/app/searchByFood",getRestaurnatFoodName)
// router.get("/increase-cart/:id", getCartItemIncrease);
// router.get("/decrease-cart/:id", getCartItemDecrease);
// router.get("/delete-cart-item/:id", getCartItemDelete);


//ye upar conflict kar raha tha isliye niche bhej diya
router.get('/:restaurantId',getRestaurant);

export default router;