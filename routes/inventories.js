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
const inventory = require("../models/inventory");

passport.use(User.createStrategy());

//Add Item
router.post("/add", (req, res, next) => {
  inventory
    .create(req.body)
    .then((item) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Item Added" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Get Items of Company
router.get("/get", (req, res, next) => {
  inventory
    .find({ company: req.headers.company })
    .populate("used_in_projects.project")
    .then((items) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, data: items });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Update Item
router.put("/update", (req, res, next) => {
  inventory
    .findById(req.body.item)
    .then((item) => {
      item.item_stock = req.body.item_stock;
      item.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Item Updated" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err: err });
    });
});

// Assign Item to Project
router.put("/assign", (req, res, next) => {
  inventory
    .findById(req.body.item)
    .then((item) => {
      item.used_in_projects.push(req.body);
      item.item_stock = item.item_stock - req.body.quantity;
      item.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Item Assigned to project" });
    })
    .catch((err) => {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, err });
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
