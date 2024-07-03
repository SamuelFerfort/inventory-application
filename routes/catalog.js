const express = require("express");
const router = express.Router();
const food_controller = require("../controllers/foodController");

/* GET users listing. */
router.get("/", food_controller.index);

router.get("/category/:id", food_controller.index)

module.exports = router;
