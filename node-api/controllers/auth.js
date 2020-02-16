const User = require("../models/user"); //loading the User Scheme
const jwt = require("jsonwebtoken"); //webtoken to help with signin
require("dotenv").config();
const expressJwt = require("express-jwt");

exports.signup = async (req,res) => {
    const userExists = await User.findOne({email: req.body.email});
    if(userExists) return res.status(403).json({
        error: "Email already registered."
    });
    const user = await new User(req.body);
    await user.save();
    res.json({
        // user:user,
        message: "Signed you up successfully! Login and create some awesome posts!!"
    });
}

exports.signin = (req,res) => {
    //check if user present, via email
    const {email, password} = req.body;
    //if not present or some error
    User.findOne({email}, (err,user) => {
        if(err || !user){
            return res.status(401).json({
                error: "This email is not registered with us. Please sign up to access the Edgistify network!"
            });
        }

        // if user found, then make sure that their email and passwords match
        // create authenticate method in model
        if(!user.authenticate(password)){
            return res.status(403).json({
                error: "Email and password don't match. Try again?"
            });
        }

        //then generate a token to mark their sign in with id and secret (from env file)
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        //retain the token in cookie, with an expiry date
        res.cookie("t",token, {expire: new Date() + 9999});

        const {_id,name,email} = user;
        //console Log
        console.log("User",user.name,"signed in successfully!");
        //return response with user and token to frontend client
        return res.json({token, user:{_id,email,name}});
    }
    ) 
}

exports.signout = (req,res) => {
    res.clearCookie("t");
    return res.json({message:"You've signed out successfully!"});
}

exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the user id in an 
    // auth key to the request object. Kind of gives away the currently logged in userID
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});