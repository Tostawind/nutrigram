# MacrosApp

---

## TO DO ✅

- 🔥 IMPORTANT
  1. [ ] INGREDIENTES
    - [ ] Vista ingredientes (lista) con boton de crear ingrediente (footer)
    - [ ] Al pulsar en ingrediente = EDITAR + Boton eliminar
    - [ ] Buscador ?
 
 2. [ ] LOADER: Crear un splash screen con loader general

- ⌛ FIXES:
  - Tabla modal: Focus input
  - Tabla modal: Al pulsar Enter que se guarde

- 🔜 FUTURO
  - Clicar o hover sobre ingrediente aparezca macros por 100g
---



## ENDPOINTS

> Pendiente revisar...

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
