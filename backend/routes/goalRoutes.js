const express = require("express");
const router = express.Router();
const {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
  getGoal,
} = require("../controllers/goalController");

const { protect } = require("../middleware/authMiddleware");

//Shortcut of the below code
router.route("/").get(protect, getGoals).post(protect, setGoals);
router
  .route("/:id")
  .delete(protect, deleteGoals)
  .put(protect, updateGoals)
  .get(protect, getGoal);

// router.get("/", getGoals);
// router.post("/", setGoals);
// router.put("/:id", updateGoals);
// router.delete("/:id", deleteGoals);

module.exports = router;
