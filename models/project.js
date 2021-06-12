var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

// const usersSchema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

const taskSchema = new Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  name: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  start_date: {
    type: String,
    default: "",
  },
  end_date: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
  assigned_to: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  progress: {
    type: Number,
    default: 0,
  },
});

const Project = new Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    start_date: {
      type: String,
      default: "",
    },
    end_date: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    technologies: [
      {
        technology: { type: mongoose.Schema.Types.ObjectId, ref: "Technology" },
        rating: {
          type: Number,
          default: null,
        },
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    team_lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // team_members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: {
      type: Number,
      default: 0,
    },
    tasks: [taskSchema],
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", Project);
