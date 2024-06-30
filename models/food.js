const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: {type: String, required: true},
  price: {type: Number, required: true},
  stock: {type: NUmber, required: true},
  imageURL: {type: String}
});

FoodSchema.virtual("url").get(function () {
    return `/catalog/food/${this._id}`
})


module.exports = mongoose.model("Food", FoodSchema)