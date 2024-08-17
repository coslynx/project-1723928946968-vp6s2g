import { isDateValid, isNumberValid, isStringValid } from "./utils";

export const validateGoal = (goal) => {
  const errors = [];

  if (!isStringValid(goal.title)) {
    errors.push("Title must be a valid string.");
  }

  if (!isStringValid(goal.description, true)) {
    errors.push("Description must be a valid string.");
  }

  if (!isDateValid(goal.target_date)) {
    errors.push("Target date must be a valid date.");
  }

  if (!isNumberValid(goal.progress)) {
    errors.push("Progress must be a valid number.");
  }

  if (goal.progress < 0 || goal.progress > 100) {
    errors.push("Progress must be between 0 and 100.");
  }

  if (!isStringValid(goal.status)) {
    errors.push("Status must be a valid string.");
  }

  if (
    goal.status !== "Active" &&
    goal.status !== "Completed" &&
    goal.status !== "In Progress"
  ) {
    errors.push("Status must be one of: Active, Completed, In Progress.");
  }

  return errors;
};

export const validatePost = (post) => {
  const errors = [];

  if (!isStringValid(post.content)) {
    errors.push("Content must be a valid string.");
  }

  return errors;
};