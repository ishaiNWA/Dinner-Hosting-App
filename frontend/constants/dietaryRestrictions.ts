// frontend/constants/dietaryRestrictions.ts
export const DIETARY_RESTRICTIONS = [
    "vegan", "vegetarian", "kosher", 
    "gluten-free", "lactose-free", "none"
  ] as const;
  
  export type DietaryRestrictionType = typeof DIETARY_RESTRICTIONS[number];