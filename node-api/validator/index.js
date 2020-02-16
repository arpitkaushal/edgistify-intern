exports.makePostValidator = (req,res,next) => {

    //title
    req.check("title", "Write a Title!").notEmpty();
    req.check("title", "The title must be between 10 to 150 characters long!").isLength({
        min:10,
        max:150
    });

    //body
    req.check("body", "Your post must have some content! Edgistify community only accepts quality content!").notEmpty();
    req.check("body", "The body must be between 200 to 2000 characters long!").isLength({
        min:200,
        max:2000
    });

    // any other errors?
    const errors = req.validationErrors();

    //if errors present, show the first one
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    
    //don't halt everything else, move on 
    next();
};


exports.userSignupValidator = (req,res,next) => {
    //name is not null and between 4 to 20 characters long!
    req.check("name", "You must have a name!").notEmpty();
    req.check("name", "Your name must be between 4 to 20 characters long!").isLength({
        min:2,
        max:20
    });

    //email is valid
    req.check("email", "Email is needed for signup!").notEmpty();
    req.check("email") 
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max: 100
    })
    .withMessage("Email must be between 4 to 100 characters.");

    //strong password
    req.check("password", "Password is required!").notEmpty();
    req.check("password")
    .isLength({
        min: 6,
        max: 32
    }).withMessage("Password must be between 6 to 32 characters long.")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}/)
    .withMessage("Password must contain at least one digit, one upper-case and one lower-case chacrater.");

    // any other errors?
    const errors = req.validationErrors();

    //if errors present, show the first one
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    
    //don't halt everything else, move on 
    next();
}









// Experiment 
    //If you want to return the entire list of errors
    // if(errors){ 
    // const listoferrors  = errors.map(error => error.msg);
    // return res.status(400).json(listoferrors);
    // }