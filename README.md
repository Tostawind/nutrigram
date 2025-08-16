# MacrosApp

---

> Importante: Settings esta creado pero no cambia los ajustes de momento está hardcodeado ya se verá si las comidas tambien son dinamicas

## To Do ✅

- [ ] Vista Recipe
- [ ] Calculo automatico de las unidades

## ENDPOINTS

**SETTINGS**

- GET /settings --> solo macros
- PUT /settings --> solo macros

**MEALS**

- GET /meals --> todas las comidas
- PUT /meals/:mealId --> actualizar meal

**RECIPES**

- GET /recipes --> todos
  - ?meal=desayuno --> filtrar por desayuno
- GET /recipes/:recipeId --> receta por ID
