const mongoose = require("mongoose");

const cocktailSchema = new mongoose.Schema({
  drinkId: String,
  name: String,
  image: String,
  searchedIngredient: String,
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cocktail", cocktailSchema);