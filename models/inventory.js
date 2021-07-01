var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

// const usersSchema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

var Inventory = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    item_name: {
      type: String,
      default: "",
    },
    item_brought_quantity: {
      type: Number,
      default: 0,
    },
    item_stock: {
      type: Number,
      default: 0,
    },
    item_price: {
      type: Number,
      default: 0,
    },
    item_bill: {
      type: String,
      default: "",
    },
    used_in_projects: [
      {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", Inventory);
