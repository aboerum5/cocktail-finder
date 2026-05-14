const express = require("express");
const router = express.Router();
const Cocktail = require("../models/Cocktail");

// Show homepage/search page
router.get("/", (req, res) => {
  res.render("index");
});

// Search cocktails by ingredient using TheCocktailDB API
router.post("/search", async (req, res) => {
  try {
    const ingredient = req.body.ingredient;

    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const cocktails = data.drinks || [];

    res.render("results", {
      ingredient: ingredient,
      cocktails: cocktails
    });
  } catch (error) {
    console.log(error);

    res.render("results", {
      ingredient: req.body.ingredient,
      cocktails: []
    });
  }
});

// Save a cocktail to MongoDB
router.post("/save", async (req, res) => {
  try {
    const newCocktail = new Cocktail({
      drinkId: req.body.drinkId,
      name: req.body.name,
      image: req.body.image,
      searchedIngredient: req.body.searchedIngredient
    });

    await newCocktail.save();

    res.redirect("/cocktails/saved");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving cocktail.");
  }
});

// Show saved cocktails from MongoDB
router.get("/saved", async (req, res) => {
  try {
    const savedCocktails = await Cocktail.find().sort({ savedAt: -1 });

    res.render("saved", {
      savedCocktails: savedCocktails
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading saved cocktails.");
  }
});

module.exports = router;