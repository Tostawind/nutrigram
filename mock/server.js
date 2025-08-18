// server.js
const jsonServer = require("json-server");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ----------------- HELPERS -----------------
function validateMacros(macros) {
  const required = ["kcal", "protein", "carbs", "fat"];
  return required.every((key) => macros.hasOwnProperty(key));
}

// ----------------- SETTINGS -----------------

server.get("/settings", (req, res) => {
  const db = router.db;
  const settings = db.get("settings").value();
  res.json(settings);
});

server.put("/settings", (req, res) => {
  const db = router.db;
  const newSettings = req.body;

  if (!newSettings.macros || !validateMacros(newSettings.macros)) {
    return res.status(400).json({ error: "Invalid macros in settings" });
  }

  db.set("settings", newSettings).write();
  res.json(newSettings);
});

// ----------------- MEALS -----------------

server.get("/meals", (req, res) => {
  const db = router.db;
  const meals = db.get("meals").value();
  res.json(meals);
});

server.put("/meals/:mealId", (req, res) => {
  const db = router.db;
  const { mealId } = req.params;
  const updatedMeal = req.body;

  if (
    !updatedMeal.name ||
    !updatedMeal.macros ||
    !validateMacros(updatedMeal.macros)
  ) {
    return res.status(400).json({ error: "Invalid meal data" });
  }

  const meal = db.get("meals").find({ id: mealId }).assign(updatedMeal).write();

  if (!meal) {
    return res.status(404).json({ error: "Meal not found" });
  }

  res.json(meal);
});

// ----------------- RECIPES -----------------

server.get("/recipes", (req, res) => {
  const db = router.db;
  let recipes = db.get("recipes").value();

  if (req.query.meal) {
    recipes = recipes.filter((recipe) => recipe.meals.includes(req.query.meal));
  }

  // mapear cada receta y sustituir los ids de ingredientes por los objetos
  const recipesWithIngredients = recipes.map((recipe) => {
    const ingredients = db
      .get("ingredients")
      .filter((ingredient) => recipe.ingredients.includes(ingredient.id))
      .value();

    return {
      ...recipe,
      ingredients,
    };
  });

  res.json(recipesWithIngredients);
});

server.get("/recipes/:recipeId", (req, res) => {
  const db = router.db;
  const { recipeId } = req.params;

  const recipe = db.get("recipes").find({ id: recipeId }).value();

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  const ingredients = db
    .get("ingredients")
    .filter((ingredient) => recipe.ingredients.includes(ingredient.id))
    .value();

  const recipeWithIngredients = {
    ...recipe,
    ingredients,
  };

  res.json(recipeWithIngredients);
});

// Use default router for other routes
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
});
