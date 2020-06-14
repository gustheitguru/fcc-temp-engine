"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const ObjectID = require("mongodb").ObjectID;
const mongo = require("mongodb").MongoClient;
const env = require("dotenv").config();
const LocalStrategy = require("passport-local");

const app = express();
var pug = require("pug");

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug"); //set view engine so pug files will change over to html
app
  .route("/") // home page index Q1
  .get((req, res) => {
    //get request function Q2
    res.render(process.cwd() + "/views/pug/index", {
      title: "Hello",
      message: "Please login"
    });
    // field give on Q2
  });

//Q3 --------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
//-------------------------------

mongo.connect(process.env.DATABASE, { useUnifiedTopology: true }, (err, db) => {
  var db = user.db('passportUsers');
  
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
  }
  app.listen();

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });
  //Q6-----------------------
  passport.use(
    new LocalStrategy(function(username, password, done) {
      db.collection("users").findOne({ username: username }, function(
        err,
        user
      ) {
        console.log("User " + username + " attempted to log in.");
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (password !== user.password) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
  //-------------------------
});

//Q7-------------------------
app.route("/").get((req, res) => {
  res.render(process.cwd() + "/views/pug/index", {
    title: "Hello",
    message: "login",
    showLogin: true
  });
});

app
  .route("/login")
  .post(
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );
//Q8------------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

//Q10----------------------------
    app.route("/register").post(
      (req, res, next) => {
        let test = req.body.username;
        console.log("user being passed = " + test);
        db.collection("users").findOne(
          { username: req.body.username },
          function(err, user) {
            if (err) {
              next(err);
            } else if (user) {
              res.redirect("/");
            } else {
              db.collection("users").insertOne(
                {
                  username: req.body.username,
                  password: req.body.password
                },
                (err, doc) => {
                  if (err) {
                    res.redirect("/");
                  } else {
                    next(null, user);
                  }
                }
              );
            }
          }
        );
      },
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res, next) => { console.log(req.user);
        res.redirect("/profile");
      }
    );


 app
 .route('/profile')
 .get(ensureAuthenticated, (req,res) => {
    res.render(process.cwd() + '/views/pug/profile', + { username: req.user.username });
 });

//--------------------------
//--------------------------

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
