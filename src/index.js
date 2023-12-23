const express = require("express");

const app = express();

const port = 3000;

const mongoose = require("mongoose");

const TaskModel = require("./model/Task");

const bodyParser = require("body-parser");

const {
  validateTask,
  handleValidationErrors,
} = require("./validator/taskValidator");

const { transformTask } = require("./transformer/taskTransformer");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/node_to_do_list")
  .then(() => {
    console.log("Mongo db connected success fully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the to do list");
});

app.get("/tasks", async (req, res) => {
  const tasks = await TaskModel.find();

  const transformedTasks = tasks.map(transformTask);

  try {
    res.send(200, { data: transformedTasks });
  } catch (error) {
    res.send(500, { error: "Internal server error" });
  }
});

app.post("/task", validateTask, handleValidationErrors, async (req, res) => {
  const { task } = req.body;

  try {
    const storedTask = await TaskModel.create({ task: task, status: false });

    res.send(200, storedTask);
  } catch (error) {
    res.send(500, { error: "Internal server error" });
  }
});

app.put(
  "/task/:taskId",
  validateTask,
  handleValidationErrors,
  async (req, res) => {
    const { taskId } = req.params;
    const { task, status } = req.body;

    try {
      const updateTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { task, status },
        {
          new: true,
        }
      );

      if (!updateTask) {
        res.send(400, { error: "Task not found" });
      }

      res.send(200, updateTask);
    } catch (error) {
      console.log(error);
      res.send(500, { error: "Internal server error" });
    }
  }
);

app.delete("/task/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const deleteTask = await TaskModel.findByIdAndDelete(taskId);

  try {
    if (!deleteTask) {
      res.send(400, { error: "Task not found" });
    }

    res.send(200, { message: "Task deleted successfully" });
  } catch (error) {
    res.send(500, { error: "Internal server error" });
  }
});

app.listen(port, (req, res) => {
  console.log("To do list working on " + port);
});
