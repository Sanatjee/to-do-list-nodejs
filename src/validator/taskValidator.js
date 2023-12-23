const { body, validationResult } = require("express-validator");

const validateTask = [body("task").notEmpty().withMessage("Task is required")];

// Function to check validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateTask,
  handleValidationErrors,
};
