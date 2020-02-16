const Post = require("../models/post"); //loading the Post Scheme
const formidable = require("formidable"); //helps with file uploading
const fs = require("fs"); //access to file syste,
const _ = require("lodash"); //for updating posts

//Displaying URLs functions
    exports.getPost = (req,res)=>{
        console.log("The feed was requested by someone.");
        const posts = Post.find()
        .populate("postedBy", "name email")
        .select("title body")  //finding all posts
        .then((posts) => {
            res.json({ posts: posts}); 
        }).catch(err => console.log(err))
    };

    exports.author = (req,res) => {
        res.send(`<center>Henlo hooman, this website was created by Arpit Kausal. <br>He is a C O D A R`);
        console.log("The user wants to know who the developer of this website is.");
    };
    
    exports.makePost = (req,res,next) =>{
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse( req, (err,fields,files) => {
            if(err) {
                return res.status(400).json({
                    error: "Image couldn't be uploaded."
                });
            }
            let post = new Post(fields);
            req.profile.hashed_password = undefined;
            req.profile.salt = undefined;
            post.postedBy = req.profile;
            if(files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path);
                post.photo.contenType = files.photo.type;
            }
            post.save((err,result) => {
                if(err){
                    return res.status(400).json({
                        error: err
                    });
                }
                res.json(result);
            })
        })
        console.log("Someone wants to make a post, I guess.");
    };

    exports.postsByUser = (req,res) => {
        Post.find({postedBy:req.profile._id})
        .populate("postedBy","_id name")
        .sort("_created")
        .exec((err,posts) => {
            if(err){
                return res.stattus(400).json({
                    error:err
                });
            }
            res.json(posts);
        })
    }

    exports.postById = (req,res,next,id) => {
        Post.findById(id)
        .populate("postedBy","_id name")
        .exec( (err,post) =>{
            if(err || !post){
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
    }

    exports.isPoster = (req,res,next) => {
        const isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id; //in the lecture he uses '===' operator but that doesn't work in this case.
        if(!isPoster) {
            return res.status(400).json({
                error: "User is not authorized."
            });
        }
        next();
    }

    exports.updatePost = (req,res,next) => {
        let post = req.post;
        post = _.extend(post, req.body);
        post.updated = Date.now();
        post.save( err => {
            if(err){
                return res.status(400).json({
                    error:err
                });
            };
            res.json(
                // {message: "Post was updated"},
                post
            );
        })
    }

    exports.deletePost = (req,res) => {
        let post = req.post;
        post.remove( (err) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            } 
            res.json({
                message: "Successfully deleted the post!"
            });   
        });
    }

    






















// NOTES 
    // 1. Got the HEADERS ERROR - 
        // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        // When? - When I had both 
            // res.send("Some text");
                // as well as 
            // res.json({ array: [{elem1},{elem2}]})
        // Reason? - I guess can't send both of these things at the same time
    // 2. We can get rid of res.status(200) because if everything is working fine, express by default sends that code
    // 3. Delete Post Workflow
    //      execute postById()
    //      postById will query the database and return that post
    //      also populate the user who created that post
    //      make post available in req as "req.post"
    //      also create method isPoster() to see if they're authorized 


//Discarded Code
    //Dummy posts json file that we were showing.
        // res.send("This is where you'll see all the posts!");
        // res.json({
        //     posts: [
        //         {title:"First Post"},
        //         {title:"Second Post"}
        //     ]
        // });

    //Code to create post, without photo
        // const post = new Post(req.body);
        // post.save( (result) => {
        //         res.json({
        //         post: result, message: "Successfully posted! Thanks for your contribution. "
        //         })
        //         console.log("Created a post!");  //use post.toString()
        //     }
        // );