const express = require("express");
const router = express.Router();
const food_controller = require("../controllers/foodController");

/* GET users listing. */
router.get("/", food_controller.index);

router.get("/category/create", food_controller.create_category_get);
router.post("/category/create", food_controller.create_category_post);

router.get("/food/create", food_controller.create_food_get);
router.post("/food/create", food_controller.create_food_post);

router.get("/category/:id", food_controller.index);

router.get("/food/:id", food_controller.food_detail_get);

router.post("/food/:id/delete", food_controller.food_delete_post);
router.get("/food/:id/delete", food_controller.food_delete_get);


router.get("/food/:id/edit", food_controller.food_update_get);
router.post("/food/:id/edit", food_controller.food_update_post);


module.exports = router;
