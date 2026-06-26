export type MealPeriod = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodOption {
  id: string;
  name: string;
  description: string;
  category: MealPeriod;
  imageUrl?: string;
  emoji: string;
  basePrice?: number; // Representing relative scale or points for a fun "budget" indicator
  customizable: boolean;
  customizationType: 'breakfast' | 'rice' | 'spaghetti' | 'yam' | 'banku' | 'snack' | 'fries';
}

export interface CustomizedMeal {
  id: string; // Unique instance ID
  baseItem: FoodOption;
  selectedStew?: string; // tomato, garden-egg, kontomire, pepper-sauce, none
  selectedBankuSide?: 'okro' | 'tomato' | 'pepper-sauce';
  selectedProteins: string[]; // chicken, beef, goat, sausage, egg, sardines, fried fish, gizzard, etc.
  selectedSides: string[]; // bread, toast, fried plantains, avocado, veggies, etc.
  selectedToppings?: string[]; // milk, sugar, butter, jam (for breakfast/kenkey)
  spaghettiStyle?: 'stewed' | 'fried';
  notes?: string;
}

export interface SavedPlate {
  id: string;
  name: string;
  meals: CustomizedMeal[];
  createdAt: string;
}
