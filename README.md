# MacrosApp

---

## TO DO ✅

- 🔥 IMPORTANT
  - Form Recta (buscador de ingredientes, selector de comida)
    1. Form agregar nueva receta
    2. Editar receta es en la misma receta
    3. Eliminar receta en la misma receta 

  - Aplicar tailwind sin romper primerng

- ⌛ FIXES:

  - Tabla modal: Focus input
  - Tabla modal: Al pulsar Enter que se guarde

- 🔜 FUTURO

---

## CALCULO

```json
"meal": {
  "id": "desayuno",
  "name": "☀️ Desayuno",
  "macros": {
    "kcal": 395,
    "protein": 25,
    "carbs": 40,
    "fat": 15
  }
},
"recipe": {
  "id": "r0001",
  "name": "Avena con Leche",
  "note": "",
  "ingredients": [
    {
      "id": "i0001",
      "name": "Avena",
      "portion": 100,
      "unit": "g",
      "macros": {
        "protein": 13,
        "fat": 6,
        "carbs": 68,
        "kcal": 379
      },
      "categories": ["carbs"],
      "note": "500g package"
    },
    {
      "id": "i0002",
      "name": "Leche ",
      "portion": 100,
      "unit": "ml",
      "macros": {
        "protein": 3.4,
        "fat": 1.6,
        "carbs": 4.8,
        "kcal": 42
      },
      "categories": ["carbs"],
      "note": "1 glass = 200ml"
    }
  ]
},

```

```ts
export function adjustIngredientsToTarget(
  ingredients: Ingredient[],
  targetMacros: Macros,
  focus: keyof Macros = 'carbs',
  iterations = 5
): Ingredient[] {
  // Creamos copias de los ingredientes para no modificar los originales
  let adjustedIngredients = ingredients.map(ing => ({
    ...ing,
    portion: ing.portion,
    macros: { ...ing.macros }
  }));

  for (let i = 0; i < iterations; i++) {
    // Ajuste por macro prioritario
    const totalFocus = adjustedIngredients.reduce(
      (sum, ing) => sum + ing.macros[focus],
      0
    );
    const factorFocus = totalFocus > 0 ? targetMacros[focus] / totalFocus : 1;
    adjustedIngredients.forEach(item => {
      item.portion *= factorFocus;
      item.macros = scaleMacros(item, item.portion);
    });

    // Ajuste proporcional para los otros macros
    (['protein', 'carbs', 'fat', 'kcal'] as (keyof Macros)[]).forEach(macro => {
      if (macro === focus) return;
      const totalMacro = adjustedIngredients.reduce((sum, ing) => sum + ing.macros[macro], 0);
      const factor = totalMacro > 0 ? targetMacros[macro] / totalMacro : 1;
      adjustedIngredients.forEach(item => {
        item.portion *= factor;
        item.macros = scaleMacros(item, item.portion);
      });
    });
  }

  return adjustedIngredients;
}
```

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
