var express = require("express");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../authenticate");

var User = require("../models/user");
const company = require("../models/company");
const { randString, sendEmail } = require("../constants/functions");
const { CLIENT_URL } = require("../constants/variables");

passport.use(User.createStrategy());

//Client Signup
router.post("/client/signup", (req, res, next) => {
  const uniqueString = randString();
  User.register(
    new User({ username: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
        console.log("Error at first");
      } else {
        user.role = 2;
        if (req.body.first_name) user.first_name = req.body.first_name;
        if (req.body.last_name) user.last_name = req.body.last_name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.mobile_number) user.mobile_number = req.body.mobile_number;

        user.email_verify_string = uniqueString;

        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            console.log("Error at second");
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

//Admin New Signup
router.post("/signup", (req, res, next) => {
  const uniqueString = randString();
  console.log("Came here");
  User.register(
    new User({ username: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        user.role = 3;
        if (req.body.first_name) user.first_name = req.body.first_name;
        if (req.body.last_name) user.last_name = req.body.last_name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.mobile_number) user.mobile_number = req.body.mobile_number;
        if (req.body.city) user.city = req.body.city;
        // if (req.body.role_id === 1 || req.body.role_id === 6)
        //   user.admin_verified = true;
        // else user.admin_verified = false;
        user.email_verify_string = uniqueString;

        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          console.log("User Created");
          company.create({ name: req.body.company_name }).then(
            (company) => {
              company.employees.push(user._id);
              company.save().then((company) => {
                console.log("Employee added");
                user.company = company._id;
                user.save();
              });
              sendEmail(
                req.body.email,
                `TOSS Email verification`,
                `Your otp is ${uniqueString}`
              );
            },
            (err) => next(err)
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

// User Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user",
        });
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "Login Successful!",
        token: token,
        // role_id: user.role_id,
        // id: user._id,
        // username: user.username,
        // first_name: user.first_name,
        // last_name: user.last_name,
        // email: user.email,
        // mobile_number: user.mobile_number,
        user: user,
      });
    });
  })(req, res, next);
});

//Add Employees
router.post("/employee/add", (req, res, next) => {
  const uniqueString = randString();
  User.register(
    new User({ username: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.role_id) user.role_id = req.body.role_id;
        if (req.body.first_name) user.first_name = req.body.first_name;
        if (req.body.last_name) user.last_name = req.body.last_name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.mobile_number) user.mobile_number = req.body.mobile_number;
        if (req.body.city) user.city = req.body.city;
        if (req.headers.company) user.company = req.headers.company;

        user.email_verify_string = uniqueString;

        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }

          company.findById(req.headers.company, (err, company) => {
            if (err) {
              res.statusCode = 404;
              res.setHeader("Content-Type", "application/json");
              res.json({ err: err });
              return;
            }
            company.employees.push(user._id);
            company.save();
            sendEmail(
              req.body.email,
              `You are invited to join ${company.name}`,
              `Open ${CLIENT_URL} and click of verify user to set password and get started. <br /> <b>OTP is</b> ${uniqueString} . <br/> Password is: ${req.body.password}`
            );

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});

//Email Verification
router.post("/verification/email", async (req, res) => {
  const { verify_id } = req.body;

  const user = await User.findOne({ email_verify_string: verify_id });
  if (user) {
    user.is_email_verified = true;
    user.email_verify_string = "";
    sendEmail(
      user.email,
      "Your email has been verified - TOSS",
      "Thank you verifying your email. Now you are enabled complete features"
    );
    await user.save();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, status: "Email Verified" });
  } else {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: false, status: "Invalid code" });
  }
});



module.exports = router;
