var express = require("express");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../authenticate");

var User = require("../models/user");
const Company = require("../models/company");
const { randString, sendEmail } = require("../constants/functions");
const { CLIENT_URL } = require("../constants/variables");
const project = require("../models/project");
const technology = require("../models/technology");

passport.use(User.createStrategy());

//Add Technology
router.post("/add", (req, res, next) => {
  technology
    .create({ name: req.body.name })
    .then((technology) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Technology added" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Get Technology Options
router.get("/get", (req, res, next) => {
  technology
    .find({})
    .select("name")
    .then((technologies) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: technologies });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

module.exports = router;
