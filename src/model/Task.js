const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    task: String,
    status: Boolean,
  },
  {
    versionKey: false,
  }
);

const TaskModel = mongoose.model("tasks", TaskSchema);

module.exports = TaskModel;
