const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        };

//Register a new user
const register = async (req,res) => {
    try{
        const {name,email,password,role} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "ALL Credentials are Required"});
        }

        const allowedRoles = ["applicant", "recruiter"];
        if (role && !allowedRoles.includes(role)){
            return res.status(400).json({message: "Invalid role"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        };
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "applicant"
        });

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.cookie("token", token, cookieOptions);
        
        res.status(201).json({message: "User registered successfully", token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

//Login a user
const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All credentials are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.cookie("token", token, cookieOptions);

        res.status(200).json({message: "Login successful", token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
       
    }catch(error){
        console.error(error);   
        res.status(500).json({message: "Server Error"});
        }
    }

// Get logged in user profile

const getMe = async (req,res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({user});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ update name if provided
        if (name) user.name = name;

        // ✅ update password if provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { register, login, getMe, updateProfile }; // ✅ add updateProfile
