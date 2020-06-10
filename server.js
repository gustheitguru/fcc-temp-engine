"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const ObjectID = require("mongodb").ObjectID;
const mongo = require("mongodb").MongoClient;
const dbKey = process.env.DATABASE;

const app = express();
var pug = require("pug");

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//Q5 ---------------------
mongo.connect(dbKey, (err, db) => {
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
    //Q4 -------------------------
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
     //done(null, null); //--Q4
      db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
    });
    //Q4 ----------------------
  }
});
//Q5 ------------------------------
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

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
