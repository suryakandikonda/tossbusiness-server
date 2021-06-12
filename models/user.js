var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var User = new Schema(
  {
    role: {
      type: Number,
      default: 1,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    mobile_number: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    pincode: {
      type: String,
      default: "",
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    email_verify_string: {
      type: String,
      default: "",
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    block_reason: {
      type: String,
      default: "",
    },
    last_check_in: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
