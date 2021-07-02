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

var jsSHA = require("jssha");

router.post("/payumoney", (req, res, next) => {
  if (
    !req.body.txnid ||
    !req.body.amount ||
    !req.body.productinfo ||
    !req.body.firstname ||
    !req.body.email
  ) {
    res.send("Mandatory fields missing");
  } else {
    var pd = req.body;
    var hashString =
      config.payumoney.key + // Merchant Key
      "|" +
      pd.txnid +
      "|" +
      pd.amount +
      "|" +
      pd.productinfo +
      "|" +
      pd.firstname +
      "|" +
      pd.email +
      "|" +
      "||||||||||" +
      config.payumoney.salt; // Your salt value
    var sha = new jsSHA("SHA-512", "TEXT");
    sha.update(hashString);
    var hash = sha.getHash("HEX");
    res.send({ hash: hash });
  }
});

passport.use(User.createStrategy());

module.exports = router;
