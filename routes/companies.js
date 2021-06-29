var express = require("express");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../authenticate");

var User = require("../models/user");
const Company = require("../models/company");
const { randString, sendEmail } = require("../constants/functions");
const { CLIENT_URL } = require("../constants/variables");
const project = require("../models/project");

passport.use(User.createStrategy());

//Get Company employees
router.get("/employees", (req, res, next) => {
  Company.findById(req.headers.company, "employees")
    .populate("employees")
    .then((users) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: users.employees });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
});

//Create Project
router.post("/createProject", (req, res, next) => {
  Company.findById(req.headers.company).then((company) => {
    project.create(req.body).then((project) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true });
    });
  });
});

// Give Rating to Company
router.put("/rateCompany", (req, res, next) => {
  Company.findById(req.body.company)
    .then((company) => {
      company.rating =
        (company.rating + req.body.rating) / (company.raters + 1);
      company.raters = company.raters + 1;
      company.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Company rated successfully" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
});

module.exports = router;
