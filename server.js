"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");

const app = express();
var pug = require('pug');

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Q3 --------------------------
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
//-------------------------------

app.set('view engine','pug'); //set view engine so pug files will change over to html
app.route('/') // home page index Q1
.get((req, res) => { //get request function Q2
  res.render(process.cwd() + '/views/pug/index', {title: 'Hello', message: 'Please login'}); 
  // field give on Q2
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
