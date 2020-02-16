//Main Workspace

//built-in packages
  const express = require("express"); //server
  const mongoose = require("mongoose"); //manages DB connection
  const bodyParser = require("body-parser"); //will parse body
  const morgan = require("morgan");   //middleware
  const dotenv = require("dotenv"); //will read .env file that has DB creds
  const expressValidator = require("express-validator"); //user friendly error messages
  const cookieParser = require("cookie-parser"); //parses cookies to help with front-end
  const fs = require("fs"); //to access files
  const cors = require("cors"); //to communicate between frontend and backend - it's a middleware

//manual packages
  const postController = require("./controllers/post"); //file that controlls what shows up on some destination after router sends a request
  const postRoutes = require("./routes/post"); //file that manages routes
  const authRoutes = require("./routes/auth");
  const userRoutes = require("./routes/user");

//initialize express, and refer as app
  const app= express();  

//configuring the stuff inside the hood - middleware
  app.use(morgan("dev")); //records the time of response of requests
  app.use(bodyParser.json()); //help parse req.body
  app.use(expressValidator());
  dotenv.config(); //loading env variables - mDB creds & the hosting port
  app.use(cookieParser()); //deals with the sign in token stored locally in the browser
  app.use(cors());  //backend (8080) connects to frontend (3000)

  //set up DB Connection
  mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
  ).then( () => console.log("The website and DB are connected. You are on fire!"));
  //if DB connection not fine
  mongoose.connection.on('error', err => console.log(`DB didn't connect, but you can troubleshoot! Here's the error: ${err.message}`));


//URL Requests - Front end
  //calling (post/auth/user)Routes to handle URLs
     app.use("/", postRoutes);
     app.use("/", authRoutes);
     app.use("/", userRoutes);
     app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({error:"You must be signed in to perform this action!"});
      }
      });

  // API routes 
  app.get("/", (req,res) => {
    fs.readFile("./docs/apiDocs.json", (err,data) => {
      if(err) return res.status(400).json({ error: err});
      const docs = JSON.parse(data);
      res.json(docs);
    })
  })
  
    
//Hosting the app on Local server
  app.listen(process.env.PORT, (err) => {
    if(err) console.log("Some error popped up:  ", err);
    else console.log("Fuck yeah!, the website is up my man!");
  });
