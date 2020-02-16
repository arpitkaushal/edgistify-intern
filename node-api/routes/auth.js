const express = require("express");
const {signup,signin,signout} = require("../controllers/auth");
const {userById} = require("../controllers/user");
const {userSignupValidator} = require("../validator");
const router = express.Router();

//Routing URLs for POST jobs
    router.post("/signup", userSignupValidator, signup);
    router.post("/signin", signin);
    router.get("/signout", signout);

    //any route containing userid will first have to go through "userById" function 
    router.param("userId", userById);
 
module.exports = router;
