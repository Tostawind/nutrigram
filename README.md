# MacrosApp

---

## DESPLEGAR 🚀

```bash
# 1. Construir proyecto:
ng build --configuration production

# 2. Desplegar en Github Pages (sustituye branch gh-pages)
npx ngh --dir=dist/nutrigram/browser
```

https://Tostawind.github.io/nutrigram/#/


## TO DO ✅

- 🔥 IMPORTANT
 1. [ ] Revisar FIXES (hacer pruebas)

- ⌛ FIXES:
  - Tabla modal: Focus input
  - Tabla modal: Al pulsar Enter que se guarde
  - Quitar autocomplete en los forms

- 🔜 FUTURO
  - Clicar o hover sobre ingrediente aparezca macros por 100g
  - Poner mas bonito el spash-screen
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
