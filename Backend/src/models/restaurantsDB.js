import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt';
import User from "./authDB.js";
import ErrorHandler from "../utils/ErrorHandler.js";


const restaurantSchema = new Schema({
    name:{
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true
    },
    address:{
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    latAndLang: [
        {
            latitude:{
                type: Number,
                required: true
            },
            longitude:{
                type : Number,
                required: true
            }
        }
    ],
    email:{
        type: String,
        lowercase: true,
        required: true,
    },
    contact:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
        required: true
    },
    discount:{
        type: Number
    },
    images:[
        {
            url: String
        }
    ],
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    resType:{
        type: String,
        reqired: true
    },
    rating: Number,
    cusines: [
        {
            category: {
                type: String,
                lowercase: true
            },
            food: [
                {
                    name: String,
                    price : Number,
                    description: String,
                    veg: Boolean,
                    images:[
                        {
                            url: String
                        }
                    ],
                    
                    reviews: [   // ✅ Add reviews inside each food item
                        {
                            userId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: User
                            },
                            rating: {
                                type: Number,
                                default: 1
                            },
                            images: [
                                {
                                    url: String
                                }
                            ],
                            message: {
                                type: String
                            },
                            username: String,
                        }
                    ]
                },
                
            ]
        }
    ],
    cusineCategories: [
        {
            name: String
        }
    ],
    menu: [
        {
            imageUrl: String
        }
    ],
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: User
            },
            rating: {
                type: Number,
                default: 1
            },
            images: [
                {
                    url: String
                }
            ],
            message: {
                type: String
            },
            username: String,
        }
    ],
},
{
    timestamps: true
})

//is function ko bana rahe taki ye ek food itme ko dudh k de sake iska use cartControler.js bar bar kiye hain
restaurantSchema.methods.getFoodItem = async function (category,id) {
    const restaurant = this;
    console.log(category);
    try {
        const index = restaurant.cusines.findIndex((cusine) =>cusine.category === category)
        if(index == -1){
            throw new ErrorHandler(404, "This category is not available in this restaurant");
        }

        const foodIndex = restaurant.cusines[index].food.findIndex((food)=> food._id.toString() === id.toString());

        if (foodIndex == -1) throw new ErrorHandler(404, "Please provide the correct food_id to add images in food");

        let food = restaurant.cusines[index].food[foodIndex];
        // console.log(food);

        return {
			foodItem: food,
			index,
			foodIndex
		};
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
}

const restaurant = mongoose.model("Restaurant", restaurantSchema);
export default restaurant;