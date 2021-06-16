var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

// const usersSchema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

var Visit = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    contact_person_type: {
      type: String,
      default: "",
    },
    mobile_number: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    next_followup_date: {
      type: String,
      default: "",
    },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Visit", Visit);
