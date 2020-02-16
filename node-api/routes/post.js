const express = require("express");
const {
    getPost,
    author,
    makePost,
    postsByUser,
    postById, 
    isPoster, 
    deletePost,
    updatePost} = require("../controllers/post");
const validator = require("../validator/index");
const router = express.Router();
const {requireSignin} = require("../controllers/auth");
const {userById} = require("../controllers/user");

//Routing URLs for POST jobs
    router.post(
    "/post/new/:userId", //the order of the following three functions matter
    requireSignin, //only signed in users can post
    makePost, //the method
    validator.makePostValidator //validates the post, doesn't work when working with form data, check lec 61
    );

//Routing URLs for DEL jobs
    router.delete("/post/:postId", requireSignin, isPoster, deletePost)

//Routing URLs for PUT jobs
    router.put("/post/:postId", requireSignin, isPoster, updatePost)

//Routing URLs for GET jobs
    router.get("/feed", requireSignin, getPost);
    router.get("/author", author);
    router.get("/post/by/:userId", requireSignin, postsByUser);

    //any route containing userid/postId will first have to go through "userById" function 
    router.param("userId", userById);
    router.param("postId", postById)

module.exports = router;
