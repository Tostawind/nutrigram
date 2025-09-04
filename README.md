# MacrosApp

---

## TO DO ✅

- 🔥 IMPORTANT
 1. [ ] Revisar FIXES (hacer pruebas)
 2. [ ] LOADER: Crear un splash screen con loader general

- ⌛ FIXES:
  - Tabla modal: Focus input
  - Tabla modal: Al pulsar Enter que se guarde

- 🔜 FUTURO
  - Clicar o hover sobre ingrediente aparezca macros por 100g
---



## ENDPOINTS

**SETTINGS**
- GET /settings
- PUT /settings

**MEALS**
- GET /meals
- PUT /meals/:mealId

**RECIPES**
- GET /recipes (queryParams: meal, ingredientId)
- GET /recipes/:recipeId
- POST /recipes
- PUT /recipes/:recipeId
- DELETE /recipes/:recipeId

**INGREDIENTS**
- GET /ingredients (queryParams: category)
- PUT /ingredients
- POST /ingredients/:ingredientId
- DELETE /ingredients/:ingredientId
