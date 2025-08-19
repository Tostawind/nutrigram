# MacrosApp

---

## To Do ✅

- [ ] **Toast**: Revisar todo los errores y mostrar toast
- [ ] **JSON-SERVER**
  - [ ] Validador de seguridad
  - [ ] Separar rutas del servidor
- [ ] **Interceptor**: (o unificar llamadas): Control y toast
- [ ] **Refactor**: Revisar antiguo y cambiar a signals (input, output)
- [-] Calculo automatico de las unidades
- [ ] RECIPES
  - Ingredientes por tabla
- [ ] SETTINGS
  - Tabla diff: Que el numero diff este en el mismo ???

- FIXES:
  - Tabla modal: Focus input
  - Tabla modal: Al pulsar Enter que se guarde


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
