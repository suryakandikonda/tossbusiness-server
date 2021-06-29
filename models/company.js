var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var Company = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    state: {
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
    rating: {
      type: Number,
      default: 0,
    },
    raters: {
      type: Number,
      default: 0,
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", Company);
