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
const post = require("../models/post");

passport.use(User.createStrategy());

//Create Post
router.post("/create", (req, res, next) => {
  post
    .create(req.body)
    .then((visit) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Post Created" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Get Posts of Company
router.get("/get", (req, res, next) => {
  post
    .find({ company: req.headers.company })
    .populate("posted_by")
    .then((posts) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: posts });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Like Project
router.put("/like", (req, res, next) => {
  post
    .findById(req.body.post)
    .then((post) => {
      post.liked_by.push(req.body.liked_by_id);
      post.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Post Liked" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Dislike Project
router.put("/dislike", (req, res, next) => {
    post
      .findById(req.body.post)
      .then((post) => {
        var liked_by = post.liked_by;
        var index = liked_by.indexOf(req.body.liked_by_id);
        if(index > -1) {
          liked_by.splice(index, 1)
        }
        post.liked_by = liked_by;
        post.save();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, message: "Post Disliked" });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, err: err });
      });
  });

// // Delete Visit by ID
// router.delete("/delete", (req, res, next) => {
//   visit.findByIdAndDelete(req.body.visitId, (err, visit) => {
//     if (err) {
//       res.statusCode = 500;
//       res.setHeader("Content-Type", "application/json");
//       res.json({ success: false, err: err });
//     } else {
//       res.statusCode = 200;
//       res.setHeader("Content-Type", "application/json");
//       res.json({ success: true, message: "Visit entry deleted" });
//     }
//   });
// });

module.exports = router;
