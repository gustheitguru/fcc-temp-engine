"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");

const app = express();
var pug = require('pug');

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','pug'); //set view engine so pug files will change over to html
app.route('/') // home page index Q1
.get((req, res) => { //get request function Q2
  res.render(process.cwd() + '/views/pug/index', {title: 'Hello', message: 'Please login'}); 
  // res.render (pug command)
  // process.cwd 
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
