
import bcrypt from "bcrypt";
import mongoose, { model, Schema } from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username:{
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true
    },
    email:{
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true
    },
    name:{
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    image:{
        type: String, //couldnary url
        required: true
    },
    orderHistory: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            
            status: {
                type: String,
                enum: ['placed', 'preparing', 'out for delivery', 'delivered'],
                default: 'placed'
            },
            items: [
                {
                    name: String,
                    price: Number,
                    quantity: Number,
                    image: String,
                    id:{
                        type: Schema.Types.ObjectId,
                        ref: "Food"
                    }
                }
            ]
        }
    ],
    password:{
        type: String,
        required: true
    },
    cart: [
        {
            food: Object,
            quantity: Number,
            restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            },
            restaurantName: String,
        }
    ],
    refreshToken:{
        type: String,
    },
    userRole:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer",
        required:true
    }
},
{
    timestamps:true
})

//jab bhi hum koi new user create karenge ya user ko call karenge to ye pre function chalega or check karga ki password hash hai ki nhi;
userSchema.pre('save',function(next){
    // console.log('hii in pre');
    if(!this.isModified('password')) return next();
    
    const user = this;
    bcrypt.hash(user.password,10,(err,hash)=>{
        if(err){
            return next(err);
        }
        user.password = hash;
        // console.log(user);
        next();
    });
})

//check the password is correct or not
userSchema.methods.isCorrectPassword = async function (enteredPassword) {
    const user = this;
    return bcrypt.compare(user.password,enteredPassword);
}

//user k ek information ko hum store kar lenge, jiski help se regresh karenge
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            userId: this._id
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

//isse user har bar aaye to leke aaye aur hum usse refresh kar denge
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            userId: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

const User = mongoose.model("User",userSchema);
export default User