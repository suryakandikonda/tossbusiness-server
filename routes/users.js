var express = require("express");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../authenticate");

var User = require("../models/user");
const company = require("../models/company");
const {
  randString,
  sendEmail,
  randPassword,
} = require("../constants/functions");
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
          sendEmail(
            req.body.email,
            `TOSS Email verification`,
            `Your otp is ${uniqueString}`
          );
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

      if (!user.is_email_verified) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          message: "Email not verified",
        });
      } else if (user.is_blocked) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          message: "Blocked",
        });
      } else {
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
      }
    });
  })(req, res, next);
});

//Add Employees
router.post("/employee/add", (req, res, next) => {
  const uniqueString = randString();
  var pwd = randPassword(8);
  User.register(new User({ username: req.body.email }), pwd, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    } else {
      if (req.body.role) user.role = req.body.role;
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
            `TOSS - You are invited to join ${company.name}.`,
            `Hi <b>${req.body.first_name}</b>, <br/>You are invited to join ${
              company.name
            } for the ${
              req.body.role === 3
                ? "Admin"
                : req.body.role === 4
                ? "Tech"
                : this.state.role === 5
                ? "Finance"
                : this.state.role === 6
                ? "Inventory"
                : "Tech"
            } role. <br/>Open ${CLIENT_URL} and click on Email verification to get started. <br /> <b>OTP for email verification: </b> ${uniqueString} <br/> <b>Password</b>: ${pwd} <br/>Use this password for first time login. You can change it after logging in from account settings.`
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      });
    }
  });
});

// Send Email Verification
router.post("/sendemailverification", (req, res, next) => {
  const verify_string = randString();
  User.findOne({ email: req.body.email })
    .then((user) => {
      user.email_verify_string = verify_string;
      user.save();
      sendEmail(
        req.body.email,
        `TOSS Email verification`,
        `Your otp is ${verify_string}`
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: "Email verification sent!" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
});

// Change Password
router.post("/resetpassword", (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    user.setPassword(req.body.password, (err) => {
      if (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, message: "Something went wrong!" });
      } else {
        user.password_reset_string = "";
        user.save();
        sendEmail(
          req.body.email,
          "TOSS - Password Changed.",
          "Hi, <br/>Password for your account is successfully updated."
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, message: "Password changed successfully" });
      }
    });
  });
});

// Forgot Password
router.post("/forgotpassword", (req, res, next) => {
  var pwd = randPassword(8);
  User.findOne({ email: req.body.email }).then((user) => {
    user.setPassword(pwd, (err) => {
      if (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, message: "Something went wrong!" });
      } else {
        user.password_reset_string = "";
        user.save();
        sendEmail(
          req.body.email,
          "TOSS - Password Changed.",
          "Hi, <br/>Password for your account is successfully updated. <br/> <b>New Password: </b>" +
            pwd
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, message: "Password changed successfully" });
      }
    });
  });
});

// Block or UnBlock Employee
router.put("/employee/blockunblock", (req, res, next) => {
  User.findById(req.body.employee)
    .then((employee) => {
      employee.is_blocked = !employee.is_blocked;
      employee.save();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, message: "Action successful" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
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
      "Thank you verifying your email."
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
