import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const signUp = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({name,email,password:hashedPassword,role:"admin"});
        const token = generateToken(newUser._id);
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:24*60*60*60*1000, //24 hours
        }); 
        return res.status(200).json({
            success:true,
            message:"User created successfully",
            user:newUser,
            token:token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:`Internal Server Error : ${error.message}`,
        });
    }
}   


export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            });
        }
        const isPasswordMatched = await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success:false,
                message:"Incorrect password",
            });
        }
        const token = generateToken(user._id);
        res.cookie("token",token,{ 
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:24*60*60*60*1000, //24 hours
        });
        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user:user,
            token:token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:`Internal Server Error : ${error.message}`,
        });
    }
} 

export const logout = async(req,res)=>{
   res.cookie("token",null,{
    expires: new Date(Date.now()),
    httpOnly:true,
   });
   return res.status(200).json({
    success:true,
    message:"User logged out successfully",
   });
}
