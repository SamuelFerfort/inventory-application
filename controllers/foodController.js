const Item = require("../models/food");
require("dotenv").config();

const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const adminPassword = process.env.ADMIN_PASSWORD;

exports.index = asyncHandler(async (req, res, next) => {
  let [foods, categories] = await Promise.all([
    Food.get,
    Category.find().sort("name"),
  ]);

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

exports.create_category_get = (req, res, next) => {
  res.render("category_form", {
    title: "Create Category",
    category: undefined,
  });
};

exports.create_category_post = [
  body("name").trim().escape().isLength({ min: 3 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.create_food_get = asyncHandler(async (req, res, next) => {
  res.render("food_form", {
    title: "Add Food",
    errors: [],
    name: undefined,
    stock: undefined,
    price: undefined,
    description: undefined,
    selected_category: undefined,
  });
});

exports.create_food_post = [
  body("name", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be a valid number")
    .trim()
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("stock", "Stock must be a valid number")
    .trim()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
    

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { name, category, description, price, stock } = req.body;

    
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      errors.errors.push({ msg: "Category does not exist", param: "category", location: "body" });
    }
    const food = new Food({
      name,
      category,
      description,
      price,
      stock,
      imageURL: `https://via.placeholder.com/300x200/FFD700/000000?text=${encodeURIComponent(
        name
      )}`,
    });

    if (!errors.isEmpty()) {
      res.render("food_form", {
        title: "Add food",
        errors: errors.array(),
        name,
        description,
        price,
        stock,
      });
    } else {
      await food.save();
      res.redirect(food.url);
    }
  }),
];

exports.food_detail_get = asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id).populate("category");

  if (!food) {
    return res.status(404).send("Food item not found");
  } else {
    res.render("food_detail", {
      food,
    });
  }
});

exports.food_delete_get = (req, res, next) => {
  res.render("delete_verification", {
    food_id: req.params.id,
    error: null,
  });
};

exports.food_delete_post = asyncHandler(async (req, res, next) => {
  if (req.body.admin_password === adminPassword) {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } else {
    res.render("delete_verification", {
      food_id: req.params.id,
      error: "Wrong Password!",
    });
  }
});

exports.food_update_get = asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id).populate("category");
  console.log(food);
  if (!food) throw new Error("Food not found");

  res.render("food_form", {
    errors: [],
    title: "Edit food",
    name: food.name,
    description: food.description,
    price: food.price,
    stock: food.stock,
    selected_category: food.category.name,
  });
});

exports.food_update_post = [
  body("name", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be a valid number")
    .trim()
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("stock", "Stock must be a valid number")
    .trim()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("food_form", {
        errors: errors.array(),
        title: "Edit food",
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
      });
      return;
    } else {
      await Food.findByIdAndUpdate(req.params.id, food, {});
      res.redirect(food.url);
    }
  }),
];
