# MacrosApp

---

## To Do ✅

- [ ] **Fix fats**
- [ ] **Toast**: Crear toast e implementar en llamadas (exito /success)
- [ ] **JSON-SERVER**
  - [ ] Verificar settings
  - [ ] Arreglar recipes
  - [ ] Arreglar ingredients
  - [ ] Validador de seguridad
  - [ ] Separar rutas del servidor
- [ ] **Interceptor**: (o unificar llamadas): Control y toast
- [ ] **Loading**: Loading en llamads (mira angular.dev @defer)
- [ ] **Refactor**: Revisar antiguo y cambiar a signals (input, output)
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
