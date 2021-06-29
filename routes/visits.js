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
const visit = require("../models/visit");

passport.use(User.createStrategy());

//Create Visit
router.post("/create", (req, res, next) => {
  visit
    .create(req.body)
    .then((visit) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Visit Created" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Get Visits by User
router.get("/get", (req, res, next) => {
  visit
    .find({ created_by: req.headers.created_by })
    .sort({ next_followup_date: 1 })
    .then((visits) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: visits });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Delete Visit by ID
router.delete("/delete", (req, res, next) => {
  visit.findByIdAndDelete(req.body.visitId, (err, visit) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Visit entry deleted" });
    }
  });
});

module.exports = router;
