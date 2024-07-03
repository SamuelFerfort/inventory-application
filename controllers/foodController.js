const Food = require("../models/food");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  let [foods, categories] = await Promise.all([Food.find(), Category.find()]);

  if (!categories && !foods) {
    res.status(500).send("An error occurred");
  }

  const categoryId = req.params.id;

  if (categoryId) {
    console.log("foods before: ", foods)

    foods = foods.filter((food) => food.category == categoryId);
    console.log("foods after: ", foods)
  }

  res.render("index", {
    title: "All Categories",
    foods,
    categories,
  });
});
