const asyncHandler = require("express-async-handler");

//Import goal model
const Goal = require("../models/goalModel");

//Import user model
const User = require("../models/userModel");

// @desc   Get all goals
// @route  GET /api/goals
// @access Private

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  console.log(req.user.id);
  res.status(200).json(goals);
});

// @desc   Get one goal
// @route  GET /api/goal
// @access Private

const getGoal = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error("ID not found");
  }

  const foundGoal = await Goal.findById(id);
  res.status(200).json(foundGoal);
});

// @desc   Set goals
// @route  POST /api/goals
// @access Private
const setGoals = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  //Get the user from the middleware
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });
  console.log("goal added");
  res.status(200).json(goal);
});

// @desc   Update goals
// @route  PUT /api/goals/:id
// @access Private
const updateGoals = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error("ID not found");
  }

  const user = await User.findById(req.user.id);

  //Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  //Make sure the logged in user matches the goal user
  //user.id = logged in user, get from token
  //goal.user = the goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized to update others goal");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(id, body, { new: true });

  res.status(200).json(updatedGoal);
});

// @desc   Delete goals
// @route  DELETE /api/goals/:id
// @access Private
const deleteGoals = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal ID not found");
  }

  const user = await User.findById(req.user.id);

  //Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  //Make sure the logged in user matches the goal user
  //user.id = logged in user, get from token
  //goal.user = the goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized to delete others goal");
  }

  await goal.remove();

  res.status(200).json({ id: id });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
  getGoal,
};
