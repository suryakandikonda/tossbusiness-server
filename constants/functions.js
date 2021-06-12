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
