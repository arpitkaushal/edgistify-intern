//models will help set format for the data
const uuidv1 = require('uuid/v1'); //generates time-stamp
const mongoose = require("mongoose"); //helps communicate with the database
const crypto = require("crypto");   //encrypting libr

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    salt: String,
    hashed_password :{
        type: String,
        required: true
    }, 
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
}
);

// Virtual fields are additional fields for a given model!
// Their values can be set manually or automatically with defined functionality
// NOTE -- virtual properties don't persist in the database
// Only written logically, not in document's collection


//virtual field
userSchema
    .virtual("password")
    .set(function(password) {
    //create temp variable called _password
    this._password = password;
    //generate a timestamp
    this.salt = uuidv1();
    //encryptedPassword()
    this.hashed_password = this.encryptPassword(password);
})
.get(function() {
    return this._password;
});


//methods
userSchema.methods = {
    encryptPassword: function (password) {
        if(!password) return "";
        try {
            return crypto
                    .createHmac("sha1",this.salt)
                    .update(password)
                    .digest("hex");
        } catch (err) {
            return "";
        }
    },

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    }
};


module.exports = mongoose.model("User",userSchema);
