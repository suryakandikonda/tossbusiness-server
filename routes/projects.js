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

//Client Assign Project to Company
router.post("/assignProject", (req, res, next) => {
  Company.findById(req.headers.company).then((company) => {
    project.create(req.body).then((project) => {
      company.projects.push(project._id);
      company.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true });
    });
  });
});

//Create Project
router.post("/createProject", (req, res, next) => {
  Company.findById(req.headers.company).then((company) => {
    project.create(req.body).then((project) => {
      company.projects.push(project._id);
      company.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true });
    });
  });
});

//Get Projects by Company ID
router.get("/getProjectsByCompanyID", (req, res, next) => {
  project
    .find({ company: req.headers.company })
    .populate("team_lead")
    .populate("client")
    .then((projects) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: projects });
    });
});

module.exports = router;
