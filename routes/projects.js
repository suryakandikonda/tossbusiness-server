var express = require("express");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../authenticate");
var ObjectId = require("mongodb").ObjectId;

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
    .populate({path: "technologies.technology"})
    .then((projects) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: projects });
    });
});

//Get Project by ID
router.get("/getProjectByID", (req, res, next) => {
  project
    .findById(req.headers.project)
    .populate("tasks.assigned_to")
    .then((project) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: project });
    });
});

router.put("/addTechnology", (req, res, next) => {
  project
    .findById(req.headers.project)
    .then((project) => {
      project.technologies.push(req.body);
      project.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Technology added to project" });
    })
    .catch((err) => {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, err: err });
    });
});

// ------------- TASKS ------------------

router.post("/createTask", (req, res, next) => {
  project
    .findById(req.body.project)
    .then((project) => {
      project.tasks.push(req.body);
      project.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Task added successfully" });
    })
    .catch((err) => {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err });
    });
});

router.put("/updateTask", (req, res, next) => {
  project.updateOne(
    {
      _id: ObjectId(req.body.project),
      "tasks._id": ObjectId(req.body.taskId),
    },
    {
      $set: {
        "tasks.$": req.body,
      },
    },
    function (err, model) {
      if (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, err });
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, message: "Task updated successfully" });
      }
    }
  );
});

module.exports = router;
