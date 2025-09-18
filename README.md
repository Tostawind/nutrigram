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

- ⌛ FIXES:
  - FACIL:

  - DIFICIL:
    - Cuando se agrega un ingrediente a la receta no hace el calculo automático, sino lo pone con 100. Al refrescar si calcula ????
    - Ajustes no queda claro la diferencia con el objetivo
    - Al cambiar los ajustes ahora la receta no calcula automatic



- 🔜 FUTURO
  - Clicar o hover sobre ingrediente aparezca macros por 100g
  - Al meterse en una meal estaria bien boton agregar añadir receta (ya seteando el meal actual)


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
