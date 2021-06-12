var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

// const usersSchema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

var Technology = new Schema(
  {
    name: {
      type: String,
      default: "",
      unique: true,
    },
    companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Technology", Technology);
