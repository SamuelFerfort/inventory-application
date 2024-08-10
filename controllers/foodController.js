const Item = require("../models/food");
const Category = require("../models/category");
require("dotenv").config();

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const adminPassword = process.env.ADMIN_PASSWORD;

exports.index = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  let foods, title;
  if (categoryId) {
    foods = await Item.findByCategoryId(categoryId);
    const category = await Category.findById(categoryId);
    title = category.name;
  } else {
    foods = await Item.findAll();
    title = "All Categories";
  }

  if (!foods) {
    res.status(500).send("An error occurred");
  }

  res.render("index", {
    title,
    foods,
  });
});

exports.create_category_get = (req, res, next) => {
  res.render("category_form", {
    title: "Create Category",
    category: undefined,
  });
};

exports.create_category_post = [
  body("name").trim().escape().isLength({ min: 3 })
  .custom( async (value) => {
    const categoryExists = await Category.findByName(value)
    if (categoryExists) throw new Error("Category already in use")
  }),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("category_form", {
        title: "Create Category",
        category: req.body.name,
        errors: errors.array(),
      });
    }

    try {
      const category = await Category.create(req.body.name);
      res.redirect(`/catalog/category/${category.id}`);
    } catch (err) {
      console.error("Error creating category:", err);
      res.status(500).send("Internal Server Error");
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
  body("name", "Name must not be empty").trim().isLength({ min: 3 }).escape(),
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
    const { name, category_id, description, price, stock, imageurl } = req.body;

    if (!errors.isEmpty()) {
      return res.render("food_form", {
        title: "Add food",
        errors: errors.array(),
        name,
        description,
        selected_category: category_id,
        price,
        stock,
        imageurl,
      });
    } else {
      const foodId = await Item.create(req.body);
      res.redirect(`/catalog/food/${foodId}`);
    }
  }),
];

exports.food_detail_get = asyncHandler(async (req, res, next) => {
  const food = await Item.findById(req.params.id);
  const category = await Category.findById(food.category_id);
  if (!food && !category) {
    return res.status(404).send("Food item not found");
  } else {
    res.render("food_detail", {
      food,
      category,
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
    await Item.delete(req.params.id);
    res.redirect("/");
  } else {
    res.render("delete_verification", {
      food_id: req.params.id,
      error: "Wrong Password!",
    });
  }
});

exports.food_update_get = asyncHandler(async (req, res, next) => {
  const food = await Item.findById(req.params.id);
  if (!food) throw new Error("Food not found");

  const category = await Category.findById(food.category_id);
  if (!category) throw new Error("Category not found");

  res.render("food_form", {
    errors: [],
    title: "Edit food",
    name: food.name,
    description: food.description,
    price: food.price,
    stock: food.stock,
    selected_category: category.id,
    imageurl: food.imageurl,
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


  

    if (!errors.isEmpty()) {
     return  res.render("food_form", {
        errors: errors.array(),
        title: "Edit food",
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        imageurl: req.body.imageurl,
        selected_category: req.body.category_id
      });
    } else {
      const foodId = await Item.update(req.params.id, req.body)
      res.redirect(`/catalog/food/${foodId}`);
    }
  }),
];
