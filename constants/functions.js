// import { MAILER_EMAIL, MAILER_PASSWORD } from "./variables";
const { MAILER_EMAIL, MAILER_PASSWORD } = require("./variables");

const nodemailer = require("nodemailer");

exports.randString = () => {
  const len = 6;
  let randStr = "";
  for (let i = 0; i < len; i++) {
    const ch = Math.floor(Math.random() * 10 + 1);
    randStr += ch;
  }
  return randStr;
};

// Random Password Generation
var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var lower = "abcdefghijklmnopqrstuvwxyz";
var digit = "0123456789";
var special = "@$!%*?&";
var all = upper + lower + digit + special;

/**
 * generate random integer not greater than `max`
 */

function rand(max) {
  return Math.floor(Math.random() * max);
}

/**
 * generate random character of the given `set`
 */

function random(set) {
  return set[rand(set.length - 1)];
}

/**
 * generate an array with the given `length`
 * of characters of the given `set`
 */

function generate(length, set) {
  var result = [];
  while (length--) result.push(random(set));
  return result;
}

/**
 * shuffle an array randomly
 */
function shuffle(arr) {
  var result = [];

  while (arr.length) {
    result = result.concat(arr.splice(rand[arr.length - 1]));
  }

  return result;
}
/**
 * do the job
 */
exports.randPassword = (length) => {
  var result = []; // we need to ensure we have some characters

  result = result.concat(generate(1, upper)); // 1 upper case
  result = result.concat(generate(1, lower)); // 1 lower case
  result = result.concat(generate(1, digit)); // 1 digit
  result = result.concat(generate(1, special)); // 1 special
  result = result.concat(generate(length - 3, all)); // remaining - whatever

  return shuffle(result).join(""); // shuffle and make a string
};

//Send Email
exports.sendEmail = async (email, subject, message) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILER_EMAIL, // generated ethereal user
      pass: MAILER_PASSWORD, // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: MAILER_EMAIL, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: "", // plain text body
    html: message, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
