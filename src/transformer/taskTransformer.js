const transformTask = (taskData) => {
  return { id: taskData._id, title: taskData.task, status: taskData.status };
};

module.exports = {
  transformTask,
};
