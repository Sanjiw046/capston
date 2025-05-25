import User from '../models/authDB.js';
import restaurant from '../models/restaurantsDB.js';
import Restaurant from '../models/restaurantsDB.js';
import uploadOnCloudnary, { uploadBatchOnCloudinary } from '../utils/CloudnaryUpload.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import ErrorWrapper from '../utils/ErrorWrapper.js';

export const postRegisterRestaurant = ErrorWrapper(async (req,res,next)=>{
    
     const {name, address,contact,discount} = req.body;
     
     if (!req.user || req.user.userRole !== "seller") {
        throw new ErrorHandler(403, "Only sellers can register restaurants");
    }

     //agar user emial bhege ya na bheje to
     const email = req.body.email || req.user.email;

     if(!email){
        throw new ErrorHandler(401,'Please verify your email and try again');
     }
     //This extracts only the keys from the req.body object as an array. req k sath jo bhi bhej rhe hain usse yaha store kiya
     const incommingFields = Object.keys(req.body);

     const requireField = ['name', 'address','contact'];
     //agar kuch missing hoga incomming field me to usse missing field me daal denge
     const missingField = requireField.filter((fields)=> !incommingFields.includes(fields));

     if(missingField.length > 0){
        throw new ErrorHandler(401,`provide missing fields ${missingField.join(',')} to add a restaurant`);
     }
     let restaurant;
     try{
        restaurant = await Restaurant.findOne({
            $or: [
                {name},
                {address}
            ]
        });
     }
     catch(errr){
        throw new ErrorHandler(500,errr.message);
     }


     //if restaurnat already exist
     if(restaurant){
        throw new ErrorHandler(401,`Restaurnat with name ${name} or address ${address} is already exist, you can update your restuarant details`);
     }

     //upload the image on cloudnary
     let cloudnaryResponce;
     try{
        cloudnaryResponce = await uploadOnCloudnary(req.file.path);
     }
     catch(err){
        throw new ErrorHandler(500,err.message);
     }
     console.log('email:', email);
     console.log("Owner ID:", req.user._id);

     // create the restaurant with the given name and address
     try{
        let newRestaurant = await Restaurant.create({
            name,
            address,
            email,
            contact,
            discount,
            coverImage: cloudnaryResponce.url,
            ownerId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Restaurant Create successfully',
            data: newRestaurant
        })
     }
     catch(err){
        console.log(err);
        throw new ErrorHandler(500,"Not able to add new Restaurnat right now!");
     }
    // res.send('done');
})



export const postCusineCategoryAdd = ErrorWrapper(async (req,res,next)=>{
    const {categories,restaurant_name} = req.body;
    
    //new array banega jisme string ko comma k through split karke
    let newCategoryList = categories.split(',');
  
    // sare new category ko lowercase me convert kar diya
    newCategoryList = newCategoryList.map(c=> c.trim().toLowerCase());
    // console.log(newCategoryList);
    
    if(!newCategoryList.length){
        throw new ErrorHandler(400, 'please provide valid category for add');
    }
    
    try{
        
        let restaurant = await Restaurant.findOne({
            name: restaurant_name
        });

        //pahale hum login karte hain phir, restaurnat ko register karte hain, so dono same hoa chahiye
        // console.log(`Restaurant email: '${restaurant.email}'`);
        // console.log(`User email: '${req.user.email}'`);
        // console.log(req.user.email===restaurant.email);
        // console.log(typeof restaurant.email, typeof req.user.email);
        if(restaurant.email !== req.user.email){
            // console.log(error.message);
            throw new ErrorHandler(401,'you are not authorized to add categories in this restaurant');
        }

        if(!restaurant){
            throw new ErrorHandler(400, 'Restaurnat not Found, Cannot add cusines');
        }
        
        //purane jo cusines pade honge database me usse nikal lete hain
        let existingCusines = restaurant.cusines;

        if(existingCusines.length){
            //naye har ek cusines ko purane har ek se mathch karnege, jo already exist hoga usse naye cusines array se hata denge
            //agar cusines already esist kar rhi hai to apne ssath category and food dono ki details rakhe gi, so hum itrate karte time .category ka use kar rhe hain
            let newCusines = newCategoryList.filter((cusine)=>{
                for(let i=0;i<existingCusines.length;i++){
                    if(existingCusines[i].category == cusine){
                        return false;
                    }
                }
                return true;
            });
            newCategoryList = newCusines;
        }
        //new cusines list ko filter wale se update kar diya
        // console.log('hii');
        // console.log('updated cusines',newCategoryList);
        

        //er new array banaya jo hum cusines name bhej rahe hain usme se jo pahale se present nhi hoga usse isme dall denge the last me iss array ko purane wale k sath merge kar denge
        let newUniqueCusinesCategory = [];
        if(existingCusines.length){
            for(let i=0;i<newCategoryList.length;i++){
                let newCategory = newCategoryList[i];
                //agar pahale se nhi hai to
                if(!existingCusines.includes(newCategory)){
                    newUniqueCusinesCategory.push(newCategory);
                }
            }
            // console.log(newUniqueCusinesCategory);
            newCategoryList = newUniqueCusinesCategory;
        }
        //jo list beje the usse chhant diye ab se update kar de rhe hain
        
        
        //ek array banaya restaurant model k according jo object ko store karega jissme, category and food ka array hoga
        let newCusines = [];

        for(let i=0;i<newCategoryList.length;i++){
            //category ko nikal liya
            let category = newCategoryList[i];
            // console.log(category);
            //object banaya
            let newCusine = {
                category,
                food: []
            };
            
            //array me dall diya
            newCusines.push(newCusine);
        }
        // console.log('last update',newCusines);

        //agar kuch naya cusine aaya hai to purane wale k aage usse add kar diya
        if(newCusines.length){
            restaurant.cusines = [...newCusines,...existingCusines];
            restaurant.save();
        }
        res.status(200).json({
            message: "Categories added successfully!",
            data: restaurant
        })

    }
     catch (error) {
        console.log(error);
        throw new ErrorHandler(500, error.message);
    }
    
})

export const postAddFoodItems = ErrorWrapper(async(req,res,next)=>{
    const requireFields = ['category','price','name','veg','restaurant_name','description'];

      //req k sath jo bhi bhej rhe hain usse yaha store kiya
    const incommingFields = Object.keys(req.body);

    const missingField = requireFields.filter((fields)=> !incommingFields.includes(fields));

     if(missingField.length > 0){
        throw new ErrorHandler(401,`provide missing fields ${missingField.join(',')} to add a restaurant`);
     }

     try{
        let {category,price,name,veg,restaurant_name,description} = req.body;

        category = category.toLowerCase();
        name = name.toLowerCase();
        restaurant_name = restaurant_name.toLowerCase();
        description = description.toLowerCase();
        veg = veg.toLowerCase();
        
        const restaurant  = await Restaurant.findOne({
            name: restaurant_name
        });
        // console.log(restaurant);
        if (!restaurant) {
            throw new ErrorHandler(404, `Restaurant with name ${restaurant_name} not found`);
        }
        // console.log(restaurant.cusines);
        let index =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[i].category == category){
                index = i;
                break;
            }
        }

        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to add ${name} eatable`);
        }

        let cloudnaryResponce = {
            url: ""
        }
        // console.log('hii for path');
        // console.log(req.file);
        if(req.file.path){
            cloudnaryResponce = await uploadOnCloudnary(req.file.path);
        }

        let vegVal = (veg =='true' ? true : false);

        let newFoodItem = {
            name: name,
            price: +price,
            veg: vegVal,
            description: description,
            images: [{
                url: cloudnaryResponce.url
            }]
        }

        //food wale array ko find kiya aur use me newfoodItem ko add kar diya, is aise bhi kar sakte hain, abhi check nhi liya hai
        // restaurant.cusines[index].food.push(newFoodItem);
        restaurant.cusines[index]["food"].push(newFoodItem);
        await restaurant.save();

        res.status(200).json({
            message: "Food item added successfully!",
            data: restaurant
        })
        
        
     }
     catch(err){
        throw new ErrorHandler(err.statusCode || 500,err.message);
     }
})


// update the food-item details stored in the food array

export const postUpdateFoodItem = ErrorWrapper(async(req,res,next)=>{
    //id ko mongodb sell se food k array me jake particular food item ki id ko utha layenge
    const {id} = req.params;
    const {name,price,veg,description,category,restaurant_name} = req.body;

    try{
        //find the restaurant
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })
        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} is not found`);
        }

        //verifyJwt me isse define kiya hai, isse login karne k bad user ki details ko access kar sakte hain like username, email etc.
        const user = req.user;

        // jab hum login karne k bad restaurant ko register karte hain to, user ki id hi restaurant ki ownerId banta hai, so jab hum kisi restaurant k food-item ko update karne ja rahe to owner ka verify hona jruri hai, so jo login kar rha hai usse restaurant me pade owner id ko match kar lenge
        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(404,"You are not authorized to perform this action");
        }

        //category ko find kar rhe hain
        let index =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[i].category == category){
                index = i;
                break;
            }
        }

        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to update the food item of ${restaurant_name}`);
        }

        //us category me jis food item ko update karna hai usse us category k food item me find kar rhe hai
        let foodIndex =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[index].food[i]._id.toString() == id.toString()){
                foodIndex = i;
                break;
            }
        }

        if (foodIndex == -1) {
            throw new ErrorHandler(404, `Please provide the correct details - food or id inorder to update the details`);
        }

        //now update 
        let foodItem = restaurant.cusines[index].food[foodIndex];

        if(name) foodItem.name = name;
        if(price) foodItem.price = price;
        if(veg) foodItem.veg = veg;
        if(description) foodItem.description = description;

        console.log(req.file);
        if(req.file){
            const cloudnaryResponce = await uploadOnCloudnary(req.file.path);
            const url = cloudnaryResponce;
            foodItem.images = url
        }

        await restaurant.save();
        res.status(200).json({
            message: "Food item updated successfully!",
            data: restaurant
        })

    }
    catch(error){
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
});


//update restaurant coverImage
export const postUpdateCoverImage = ErrorWrapper(async(req,res,next)=>{
    const {restaurant_name} = req.body;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} is not found`)
        }

        const user = req.user;

        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(404,"You are not authorized to perform this action");
        }

        if(!req.file){
            throw new ErrorHandler(404,"please upload image file");
        }

        if(req.file){
            const cloudnaryResponce = await uploadOnCloudnary(req.file.path);
            console.log(cloudnaryResponce);
            const url = cloudnaryResponce.secure_url;
            restaurant.coverImage = url;
        }

        await restaurant.save();
        res.status(200).json({
            message: 'CoverImage updated successfully',
            data: restaurant
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

//update restaurant name
export const postUpdateName = ErrorWrapper(async(req,res,next)=>{
    
    const {restaurant_name,new_name} = req.body;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} is not found`)
        }

        const user = req.user;

        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(404,"You are not authorized to perform this action");
        }
        restaurant.name = new_name;
        await restaurant.save();
        res.status(200).json({
            message: 'CoverImage updated successfully',
            data: restaurant
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


//update contact Number
export const postUpdateResContactNumber = ErrorWrapper(async(req,res,next)=>{
    console.log("Request received at /restaurant/update-name");
    console.log("Request body:", req.body);
    console.log("User:", req.user);
    const {restaurant_name,new_number} = req.body;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} is not found`)
        }

        const user = req.user;

        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(404,"You are not authorized to perform this action");
        }
        restaurant.contact = new_number;
        await restaurant.save();
        res.status(200).json({
            message: 'Contact updated successfully',
            data: restaurant
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

//delete the particular food item
export const getDeleteFoodItem = ErrorWrapper(async (req,res,next)=>{

    //id ko mongodb sell se food k array me jake particular food item ki id ko utha layenge
    const {id} = req.params;

    //get req bhejte hain to query me data jata hai
    const {restaurant_name, category} = req.query;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} not found`);
        }

        const user = req.user;

        //upar dekh lo same kiya hai
        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }

        //category ko find kar rhe hain
        let index =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[i].category == category){
                index = i;
                break;
            }
        }

        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to update the food item of ${restaurant_name}`);
        }

        //us category me jis food item ko update karna hai usse us category k food item me find kar rhe hai
        let foodIndex =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[index].food[i]._id.toString() == id.toString()){
                foodIndex = i;
                break;
            }
        }

        if (foodIndex == -1) {
            throw new ErrorHandler(404, `Please provide the correct details - food or id inorder to update the details`);
        }

        //now delete the food item
        //The splice() method modifies the array by removing or adding elements.
        //1 indicates that only 1 element should be removed starting from foodIndex.
        restaurant.cusines[index].food.splice(foodIndex,1);

        await restaurant.save();

        res.status(200).json({
            message : 'Mentioned Food item delete successfully',
            restaurant
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
});



//in this we are going to find all food items from a particular category
export const getFoodItems = ErrorWrapper(async (req,res,next)=>{

    //get req bhejte hain to query me data jata hai
    const {restaurant_name, category} = req.query;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} not found`);
        }

        const user = req.user;

        //upar dekh lo same kiya hai
        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }

        //category ko find kar rhe hain
        let index =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[i].category == category){
                index = i;
                break;
            }
        }

        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want the food item of ${restaurant_name}`);
        }

        const food = restaurant.cusines[index].food;

        res.status(200).json({
            message : ' Food items fetched successfully',
            data: food
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
});


//yaha kisi paticular category k all food items me se ek nikal rhe
export const getFoodItem = ErrorWrapper(async (req,res,next)=>{

    //id ko mongodb sell se food k array me jake particular food item ki id ko utha layenge
    const {id} = req.params;

    //get req bhejte hain to query me data jata hai
    const {restaurant_name, category} = req.query;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} not found`);
        }

        const user = req.user;
        // console.log(user._id);
        // console.log(restaurant.ownerId);
        //upar dekh lo same kiya hai
        // if(user._id.toString() !== restaurant.ownerId.toString()){
        //     throw new ErrorHandler(401, "You are not authorized to perform this action");
        // }

        //category ko find kar rhe hain
        let index =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[i].category == category){
                index = i;
                break;
            }
        }

        console.log(index);
        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to grt the food item of ${restaurant_name}`);
        }

        //us category me jis food item ko update karna hai usse us category k food item me find kar rhe hai
        
        let foodIndex =-1;
        console.log(restaurant.cusines[index].food.length);
        for(let i=0;i<restaurant.cusines[index].food.length;i++){
            if(restaurant.cusines[index].food[i]._id.toString() === id.toString()){
                foodIndex = i;
                break;
            }
        }

        if (foodIndex == -1) {
            throw new ErrorHandler(404, `Please provide the correct details - food or id inorder to update the details`);
        }

        const food = restaurant.cusines[index].food[foodIndex];
        res.status(200).json({
            message : 'Mentioned Food item fetch successfully',
            data : food
        })

    } catch (error) {
        console.log(error)
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
});


//jitne bhi cuisines hai unhe nikal rhe hain
export const getAllCusines = ErrorWrapper(async (req,res,next)=>{

    //get req bhejte hain to query me data jata hai
    const {restaurant_name} = req.query;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} not found`);
        }

        const user = req.user;

        //upar dekh lo same kiya hai
        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }

        const food = restaurant.cusines;

        res.status(200).json({
            message : ' All cusines fetched successfully',
            data: food
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
});



//kisi particular food-item k liye images ko add karna
export const postAddFoodImages = ErrorWrapper(async (req,res,next)=>{

    //id ko mongodb sell se food k array me jake particular food item ki id ko utha layenge
    const {id} = req.params;

    //get req bhejte hain to query me data jata hai
    const {restaurant_name, category} = req.body;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404,`Restaurant with name ${restaurant_name} not found`);
        }

        const user = req.user;

        //upar dekh lo same kiya hai
        if(user._id.toString() !== restaurant.ownerId.toString()){
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }

        //category ko find kar rhe hain
        let index =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[i].category == category){
                index = i;
                break;
            }
        }

        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to update the food item of ${restaurant_name}`);
        }

        //us category me jis food item ko update karna hai usse us category k food item me find kar rhe hai
        let foodIndex =-1;
        for(let i=0;i<restaurant.cusines.length;i++){
            if(restaurant.cusines[index].food[i]._id.toString() == id.toString()){
                foodIndex = i;
                break;
            }
        }

        if (foodIndex == -1) {
            throw new ErrorHandler(404, `Please provide the correct details - food or id inorder to update the details`);
        }

        //jis food item k images ko add karna hai usse find kar liya
        const food = restaurant.cusines[index].food[foodIndex];
        //images k path ko nikala
        const images = req.files;

        if(images.length == 0){
            throw new ErrorHandler(400, " Please provide images to upload");
        }

        const imageUrls = [];
        //cloudnary pe upload kiya,  is function ko coudnaryUpload.js me banay hai
        const cloudnaryResponce = await uploadBatchOnCloudinary(images);

        for(let i =0;i<cloudnaryResponce.length;i++){
            imageUrls.push({
                url: cloudnaryResponce[i].url
            })
        }

        //purane images k sath nay ko add kar kar diya
        food.images = [...imageUrls,...food.images];
        await restaurant.save();

        res.status(200).json({
            success: true,
            message : 'Images upload successfully',
            data: food
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
});


//get all the restaurants 
export const getRestaurants = ErrorWrapper(async (req,res,next)=>{
    try {
        const restaurant = await Restaurant.find();

        res.status(200).json({
            success: true,
            message: 'Restaurants Fetched Successfully',
            restaurant: restaurant
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

//get single restaurant
export const getRestaurant = ErrorWrapper(async (req,res,next)=>{
    const {restaurantId} = req.params;
    try {
        const restaurant = await Restaurant.find({_id: restaurantId});

        res.status(200).json({
            success: true,
            message: 'Restaurant Fetched Successfully',
            restaurant: restaurant
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


//get restaurant by name
export const getRestaurantByName = ErrorWrapper(async (req,res,next)=>{
    const {name} = req.query;
    try {
        const restaurant = await Restaurant.find({name: { $regex: name, $options: 'i' }});

        if(!restaurant){
            throw new ErrorHandler(404," Enter the currect restaurant name");
        }
        res.status(200).json({
            success: true,
            message: 'Restaurant Fetched Successfully',
            restaurant: restaurant
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


//get all the restaurant which is related to a particulat owner
export const getMyRestaurants = ErrorWrapper(async( req,res,next)=>{
    console.log('hii');
    //get logged-in userId
    const userId = req.user._id;

    try {
        const myRestaurants = await Restaurant.find({
            ownerId: userId
        })
    
        if (!myRestaurants.length) {
            return res.status(404).json({
                success: false,
                message: "No restaurants found for this user.",
            });
        }
    
        res.status(200).json({
            success: true,
            message: "Restaurants fetched successfully",
            data: myRestaurants,
        });
    } catch (error) {
        throw new ErrorHandler(500, "Error fetching restaurants");
    }
})



// CRUD operation on Review

export const postAddReview = ErrorWrapper(async (req,res,next)=>{
    const {restaurant_name,ratting,message} = req.body;
    const {name} = req.user;
    const userId = req.user._id;

    try {
        const restaurant = await Restaurant.findOne({
            name : restaurant_name
        })

        if(!restaurant){
            throw new ErrorHandler(404," Restaurant not found");
        }

        if(userId.toString() === restaurant.ownerId.toString()){
            throw new ErrorHandler(400, "You can't review your own restaurant");
        }

         // Ensure `ratting` is a valid number
         if (!ratting || isNaN(ratting) || Number(ratting) < 1 || Number(ratting) > 5) {
            throw new ErrorHandler(400, "Rating must be a number between 1 and 5");
        }

        const responsce = await uploadBatchOnCloudinary(req.files);
        const imageUrls = [];
        for(let i =0;i<responsce.length;i++){
            imageUrls.push({
                url : responsce[i].url
            })
        }

        const review = {
            username : name,
            rating : +ratting,
            message,
            userId,
            images: imageUrls
        }

        restaurant.reviews.push(review);
        await restaurant.save();

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
})


//kisi particular restaurant k kisi food k liye review add karna
export const postAddFoodReview = ErrorWrapper(async (req, res, next) => {
    const { restaurantId, foodId } = req.params;
    const { rating, message } = req.body;
    const userId = req.user._id;
    const username = req.user.username; // Assuming username is stored in req.user

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new ErrorHandler(404, "Restaurant not found");
        }

        let foodItem = null;
        let cuisineIndex = -1;
        let foodIndex = -1;

        // Find the food item in the cuisines array
        for (let i = 0; i < restaurant.cusines.length; i++) {
            let foodIdx = restaurant.cusines[i].food.findIndex(food => food._id.toString() === foodId);
            if (foodIdx !== -1) {
                foodItem = restaurant.cusines[i].food[foodIdx];
                cuisineIndex = i;
                foodIndex = foodIdx;
                break;
            }
        }

        if (!foodItem) {
            throw new ErrorHandler(404, "Food item not found");
        }

         // Ensure `ratting` is a valid number
         if (!rating || isNaN(rating) || Number(rating) < 1 || Number(rating) > 5) {
            throw new ErrorHandler(400, "Rating must be a number between 1 and 5");
        }

        // Add the review to the food item's reviews array
        const newReview = {
            userId,
            rating: Number(rating),
            message,
            username,
        };
        
        restaurant.cusines[cuisineIndex].food[foodIndex].reviews.push(newReview);
        await restaurant.save();

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            reviews: restaurant.cusines[cuisineIndex].food[foodIndex].reviews,
        });
    } catch (error) {
        console.log(error)
        next(new ErrorHandler(error.statusCode || 500, error.message));
    }
});



export const postUpdateReview = ErrorWrapper(async (req,res,next)=>{
    //jis review ko update karna hai uski id ko mongidb se utha sakte hain
    const {reviewId} = req.params;
    const {ratting,restaurant_name,message} = req.body;

    const userId = req.user._id;
    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        });

        if(!restaurant){
            throw new ErrorHandler(404," Restaurant not found");
        }

        //findIndex ek method hai js me, har ek review ki  apni ek id hai agar wo match ho jayegi reviewId (jisse hum apni taraf se postman ya frontend se bhejenge), to kis index pe review present mil jayega ya, -1 dega
        const index = restaurant.reviews.findIndex(r=> r._id,toString() == reviewId.toString());

        if (index === -1) {
            throw new ErrorHandler(404, "Review not found, that you are trying to update");
        }

        if(userId.toString() !== restaurant.reviews[index].userId.toString()){
            throw new ErrorHandler(400, "You are not authorized to update the review");
        }

        if(Number(ratting) <1 || Number(ratting)>5){
            throw new ErrorHandler(400, "Rating must be between 1 and 5");
        }

        if(ratting) restaurant.reviews[index].rating = +ratting;
        if(message) restaurant.reviews[index].message = message;

        await restaurant.save();
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            restaurant,
        });

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
})

export const getDeleteReview = ErrorWrapper(async (req,res,next)=>{
    const {reviewId} = req.params;
    const {restaurant_name} = req.query;

    const userId = req.user._id;
    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        });

        if(!restaurant){
            throw new ErrorHandler(404," Restaurant not found");
        }

        //findIndex ek method hai js me, har ek review ki  apni ek id hai agar wo match ho jayegi reviewId (jisse hum apni taraf se postman ya frontend se bhejenge), to kis index pe review present mil jayega ya, -1 dega
        const index = restaurant.reviews.findIndex(r=> r._id,toString() == reviewId.toString());

        if (index === -1) {
            throw new ErrorHandler(404, "Review not found, that you are trying to Delete");
        }

        if(userId.toString() !== restaurant.reviews[index].userId.toString()){
            throw new ErrorHandler(400, "You are not authorized to Delete the review");
        }

        restaurant.reviews.splice(index,1);

        await restaurant.save();
        res.status(200).json({
            success: true,
            message: "Review Deleted successfully",
            restaurant,
        });

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
})


export const getAllReviews = ErrorWrapper(async (req,res,next)=>{
    // console.log('hii for all review');
    const {restaurant_name} = req.query;

    const userId = req.user._id;
    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        });

        

        if(!restaurant){
            throw new ErrorHandler(404," Restaurant not found");
        }

        res.status(200).json({
            success: true,
            message: "Review Fetched successfully",
            reviews: restaurant.reviews,
        });

    } catch (error) {
        console.log(error)
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
})

export const getFoodReviews = ErrorWrapper(async (req, res, next) => {
    const { restaurantId, foodId } = req.params;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return next(new ErrorHandler(404, "Restaurant not found"));
        }

        let foodReviews = null;

        for (let cuisine of restaurant.cusines) {
            let foodItem = cuisine.food.find(food => food._id.toString() === foodId);
            if (foodItem) {
                foodReviews = foodItem.reviews;
                break;
            }
        }

        if (!foodReviews) {
            return next(new ErrorHandler(404, "Food item not found"));
        }

        res.status(200).json({
            success: true,
            reviews: foodReviews,
        });

    } catch (error) {
        next(new ErrorHandler(error.statusCode || 500, error.message));
    }
});


export const getReview = ErrorWrapper(async (req,res,next)=>{
    //jis review ko update karna hai uski id ko mongidb se utha sakte hain
    const {reviewId} = req.params;
    const {restaurant_name} = req.query;

    try {
        const restaurant = await Restaurant.findOne({
            name: restaurant_name
        });

        if(!restaurant){
            throw new ErrorHandler(404," Restaurant not found");
        }

        //findIndex ek method hai js me, har ek review ki  apni ek id hai agar wo match ho jayegi reviewId (jisse hum apni taraf se postman ya frontend se bhejenge), to kis index pe review present mil jayega ya, -1 dega
        const index = restaurant.reviews.findIndex(r=> r._id,toString() == reviewId.toString());

        if (index === -1) {
            throw new ErrorHandler(404, "Review not found, that you are trying to Find");
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: restaurant.reviews[index]
        });

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
})


export const getRestaurnatFoodName = ErrorWrapper(async (req,res,next)=>{
    //jis review ko update karna hai uski id ko mongidb se utha sakte hain
    const { foodName } = req.query;
    

    try {
        
        if(!foodName){
            throw new ErrorHandler(404," Foodname not found");
        }

        const matchingRestaurants = await Restaurant.find({
            cusines: {
                $elemMatch: {
                    food: {
                        $elemMatch: {
                        name: { $regex: new RegExp(foodName, 'i') } // Case-insensitive search
                        }
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "all Restaurant fetch successfully ",
            restaurants: matchingRestaurants
        });

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 400, error.message);
    }
})