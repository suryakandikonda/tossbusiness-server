var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

// const usersSchema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

var Post = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    liked_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", Post);
