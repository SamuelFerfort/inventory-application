#! /usr/bin/env node
require("dotenv").config();



const Food = require("./models/food");
const Category = require("./models/category");

const foods = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.DEV_DB_URL;

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createFoods();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Meat"),
    categoryCreate(1, "Vegetable"),
    categoryCreate(2, "Fruit"),
  ]);
}

async function foodCreate(
  index,
  name,
  category,
  description,
  price,
  stock,
  imageURL
) {
  const foodDetail = {
    name,
    category,
    description,
    price,
    stock,
    imageURL,
  };

  const food = new Food(foodDetail);
  await food.save();
  foods[index] = food;
  console.log(`Added food: ${name}`);
}

async function createFoods() {
  console.log("Adding Foods");
  await Promise.all([
    foodCreate(
      0,
      "Chicken",
      categories[0],
      "Free-range, hormone-free chicken breast. Lean and versatile protein source.",
      5,
      20,
      "https://via.placeholder.com/300x200/FFA07A/000000?text=Chicken"
    ),
    foodCreate(
      1,
      "Beef",
      categories[0],
      "Premium grass-fed beef sirloin. Rich in flavor and essential nutrients.",
      8,
      30,
      "https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Beef"
    ),
    foodCreate(
      2,
      "Pork",
      categories[0],
      "Tender pork loin from ethically raised pigs. Perfect for roasting or grilling.",
      6,
      45,
      "https://via.placeholder.com/300x200/FFC0CB/000000?text=Pork"
    ),
    foodCreate(
      3,
      "Broccoli",
      categories[1],
      "Fresh, crisp broccoli florets. High in fiber and vitamin C.",
      2,
      10,
      "https://via.placeholder.com/300x200/228B22/FFFFFF?text=Broccoli"
    ),
    foodCreate(
      4,
      "Spinach",
      categories[1],
      "Organic baby spinach leaves. Packed with iron and antioxidants.",
      3,
      5,
      "https://via.placeholder.com/300x200/32CD32/FFFFFF?text=Spinach"
    ),
    foodCreate(
      5,
      "Carrot",
      categories[1],
      "Sweet and crunchy carrots. Excellent source of beta-carotene and fiber.",
      1,
      15,
      "https://via.placeholder.com/300x200/FFA500/000000?text=Carrot"
    ),
    foodCreate(
      6,
      "Banana",
      categories[2],
      "Ripe, yellow bananas. Rich in potassium and natural sweetness.",
      0.5,
      18,
      "https://via.placeholder.com/300x200/FFD700/000000?text=Banana"
    ),
    foodCreate(
      7,
      "Apple",
      categories[2],
      "Crisp and juicy apples. Great for snacking or baking.",
      0.75,
      20,
      "https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Apple"
    ),
    foodCreate(
      8,
      "Strawberry",
      categories[2],
      "Plump, red strawberries. Bursting with vitamin C and antioxidants.",
      3,
      8,
      "https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=Strawberry"
    ),
  ]);
}
