import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique:true,
        },
        email :{
            type: String,
            required: true,
            unique:true,
        },
        password: {
            type: String,
            required: false,
            minlenght: 6
        },
        gender : {
            type: String,
            required: false,
            enum: ['male', 'female'],
        },
        role: {
            type: String,
        }
    },
 { timestamps: true });

const User = mongoose.model("users", userScheme);
export default User;
