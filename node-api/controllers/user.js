const _ = require("lodash");
const User = require("../models/user"); //loading the User Scheme

exports.userById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user) return res.status(401).json({error: "User not found!"});
        req.profile = user; // adds 'profile object' (made by us) in req with user info!
        next();
    });
}

exports.hasAuthorization = (req,res,next) => {
    const authorized  = 
        req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized) return res.status(403).json({ error: "You don't have enough rights to make these changes."});
}

exports.allUsers = (req,res) => {
    User.find( (err,users) => {
        if(err) return res.status(400).json({error: err});
        res.json({users});
    }).select("name email created updated");
}

exports.getUser = (req,res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req,res) => {
    let user = req.profile; //access the user from the header
    user = _.extend(user,req.body); //make necessary changes in the DB
    user.updated = Date.now(); //setting the Updated Date
    user.save(err => { 
    if(err) {
        return res.status(403).json({
            error:"No changes were made. Check log for details."
        });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    user.__v = undefined;
    return res.json({user});
    });

}

exports.deleteUser = (req,res) => {
    let user = req.profile;
    user.remove( (err,user) => {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
        res.json({message:"Successfully deleted this user."});
    });
}