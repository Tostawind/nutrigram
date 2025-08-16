# MacrosApp

---

> Importante: Settings esta creado pero no cambia los ajustes de momento está hardcodeado ya se verá si las comidas tambien son dinamicas

## To Do ✅

- [ ] Sistema de llamadas donde muestre error por TOAST
  - [ ] Fijarse bien en el settings y meals que es que está funcionando
  - [ ] Validar en el front que se manda el formato correcto y si no mostrar error
  - [ ] Se podrá validar en supabase o se en json-server
- DESPUES
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
