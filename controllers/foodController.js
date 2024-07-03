const Food = require("../models/food");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  let [foods, categories] = await Promise.all([Food.find(), Category.find().sort("name")]);

  if (!categories && !foods) {
    res.status(500).send("An error occurred");
  }

  const categoryId = req.params.id;
  let title = "All Categories";
  if (categoryId) {
    foods = foods.filter((food) => food.category == categoryId);
    const category = categories.find(
      (category) => category._id.toString() == categoryId
    );
    if (category) title = category.name;
  }

  res.render("index", {
    title,
    foods,
    categories,
  });
});
