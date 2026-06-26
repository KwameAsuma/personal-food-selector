import { FoodOption } from './types';

export const FOOD_ITEMS: FoodOption[] = [
  // --- BREAKFAST ---
  {
    id: 'milo_bf',
    name: 'Milo',
    description: 'Chilled or warm rich chocolate malt beverage, delicious and energizing.',
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    emoji: '☕',
    customizable: true,
    customizationType: 'breakfast'
  },
  {
    id: 'oats_bf',
    name: 'Oats Porridge',
    description: 'Silky, creamy breakfast oats served hot in a glass jar, topped with fresh sliced fruits or sweet chocolate.',
    category: 'breakfast',
    imageUrl: '/images/oats.jpg',
    emoji: '🥣',
    customizable: true,
    customizationType: 'breakfast'
  },
  {
    id: 'tom_brown_bf',
    name: 'Tom Brown',
    description: 'Nourishing and thick toasted cornmeal porridge served sweet in a warm, rustic clay-colored mug.',
    category: 'breakfast',
    imageUrl: '/images/tom brown.jpg',
    emoji: '🍯',
    customizable: true,
    customizationType: 'breakfast'
  },
  {
    id: 'cereal_bf',
    name: 'Cereal Bowls',
    description: 'Crispy toasted breakfast cereals presented in multiple classic white bowls, ready to pair with ice-cold milk.',
    category: 'breakfast',
    imageUrl: '/images/cereal.jpg',
    emoji: '🥣',
    customizable: true,
    customizationType: 'breakfast'
  },

  // --- LUNCH ---
  {
    id: 'jollof_rice_lh',
    name: 'Jollof Rice',
    description: 'Authentic slow-cooked smoky Ghanaian Jollof rice, served in a steaming bowl with delicious flame-grilled chicken wings.',
    category: 'lunch',
    imageUrl: '/images/jollof.jpg',
    emoji: '🍚',
    customizable: true,
    customizationType: 'rice'
  },
  {
    id: 'white_rice_lh',
    name: 'White Rice',
    description: 'Fluffy, perfectly steamed long-grain white rice served with a side of rich, spiced local tomato stew.',
    category: 'lunch',
    imageUrl: '/images/white rice.jpg',
    emoji: '🍚',
    customizable: true,
    customizationType: 'rice'
  },
  {
    id: 'spaghetti_lh',
    name: 'Spaghetti',
    description: 'Tender, saucy spaghetti tossed with rich tomato bolognese sauce, served in a deep black chef\'s bowl.',
    category: 'lunch',
    imageUrl: '/images/spaghetti.jpg',
    emoji: '🍝',
    customizable: true,
    customizationType: 'spaghetti'
  },
  {
    id: 'fries_lh',
    name: 'Fries',
    description: 'Crispy golden French fries, perfectly salted and served hot.',
    category: 'lunch',
    imageUrl: '/images/fries.jpg',
    emoji: '🍟',
    customizable: true,
    customizationType: 'fries'
  },

  // --- DINNER (Evening) ---
  {
    id: 'boiled_yam_dn',
    name: 'Boiled Yam',
    description: 'Fluffy, soft-boiled traditional white yam, perfectly paired with savory warm stews.',
    category: 'dinner',
    imageUrl: '/images/boiled yam.jpg',
    emoji: '🍠',
    customizable: true,
    customizationType: 'yam'
  },
  {
    id: 'fried_yam_dn',
    name: 'Fried Yam',
    description: 'Crispy, golden-fried yam slices, hot and perfect with spicy pepper sauce or Shito.',
    category: 'dinner',
    imageUrl: '/images/fried yam.jpg',
    emoji: '🍟',
    customizable: true,
    customizationType: 'yam'
  },
  {
    id: 'banku_dn',
    name: 'Fresh Banku',
    description: 'Hot fermented corn and cassava dough balls, served with a large fresh grilled tilapia, red hot pepper sauce, and sliced red onions.',
    category: 'dinner',
    imageUrl: '/images/banku.jpg',
    emoji: '🫓',
    customizable: true,
    customizationType: 'banku'
  },
  {
    id: 'jollof_rice_dn',
    name: 'Jollof Rice (Dinner)',
    description: 'Flavorful slow-cooked smoky Jollof rice, served in a steaming bowl with delicious flame-grilled chicken wings.',
    category: 'dinner',
    imageUrl: '/images/jollof.jpg',
    emoji: '🍚',
    customizable: true,
    customizationType: 'rice'
  },
  {
    id: 'white_rice_dn',
    name: 'White Rice (Dinner)',
    description: 'Fluffy, perfectly steamed long-grain white rice served with a side of rich, spiced local tomato stew.',
    category: 'dinner',
    imageUrl: '/images/white rice.jpg',
    emoji: '🍚',
    customizable: true,
    customizationType: 'rice'
  },
  {
    id: 'spaghetti_dn',
    name: 'Spaghetti (Dinner)',
    description: 'Tender, saucy spaghetti tossed with rich tomato bolognese sauce, served in a deep black chef\'s bowl.',
    category: 'dinner',
    imageUrl: '/images/spaghetti.jpg',
    emoji: '🍝',
    customizable: true,
    customizationType: 'spaghetti'
  },
  {
    id: 'fries_dn',
    name: 'Fries (Dinner)',
    description: 'Crispy golden French fries, perfectly salted and served hot.',
    category: 'dinner',
    imageUrl: '/images/fries.jpg',
    emoji: '🍟',
    customizable: true,
    customizationType: 'fries'
  },

  // --- SNACKS ---
  {
    id: 'pizza_sn',
    name: 'Cheesy Pizza',
    description: 'A freshly baked whole hot cheesy pizza topped with rich marinara sauce, melting mozzarella cheese, and fresh herbs.',
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    emoji: '🍕',
    customizable: true,
    customizationType: 'snack'
  },
  {
    id: 'shawarma_sn',
    name: 'Beef Shawarma Wrap',
    description: 'Two freshly toasted flatbread wraps tightly packed with slow-roasted spiced beef chunks, sweet onion, cabbage, and rich garlic sauce.',
    category: 'snacks',
    imageUrl: '/images/shawarma.jpg',
    emoji: '🌯',
    customizable: true,
    customizationType: 'snack'
  },
  {
    id: 'loaded_fries_sn',
    name: 'Loaded Fries',
    description: 'A massive heap of crispy golden French fries smothered in melting cheddar, garlic cream sauce, and served with sweet red ketchup.',
    category: 'snacks',
    imageUrl: '/images/loaded fries.jpg',
    emoji: '🍟',
    customizable: true,
    customizationType: 'fries'
  },
  {
    id: 'toast_sn',
    name: 'Crispy Toast',
    description: 'Crispy golden toast spread with delicious creamy mashed avocado and topped with soft-boiled eggs.',
    category: 'snacks',
    imageUrl: '/images/toast.jpg',
    emoji: '🍞',
    customizable: true,
    customizationType: 'snack'
  },
  {
    id: 'blended_kenkey_sn',
    name: 'Blended Kenkey',
    description: 'Chilled local Kenkey smoothie whipped with creamy milk and sweetener.',
    category: 'snacks',
    imageUrl: '/images/mashed kenkey.jpg',
    emoji: '🥤',
    customizable: true,
    customizationType: 'snack'
  },
  {
    id: 'khebab_sn',
    name: 'Spiced Khebab',
    description: 'Tender beef chunks skewered with onions and peppers, grilled over charcoal, and seasoned with authentic spicy suya rub.',
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    emoji: '🍢',
    customizable: true,
    customizationType: 'snack'
  }
];

// Customization options database
export const STEW_OPTIONS = [
  { id: 'tomato_stew', name: 'Tomatoes Stew', emoji: '🍅', description: 'Rich tomato, onion, and red pepper reduction.' },
  { id: 'garden_egg_stew', name: 'Garden Eggs Stew', emoji: '🍆', description: 'Creamy, earthy traditional African eggplants stew.' },
  { id: 'kontomire_stew', name: 'Kontomire Stew', emoji: '🥬', description: 'Delicious, spiced cocoyam leaves (spinach-like) stew.' },
  { id: 'pepper_sauce', name: 'Pepper Sauce', emoji: '🌶️', description: 'Spicy green chili paste or dark savory Shito sauce.' }
];

export const PROTEIN_OPTIONS = [
  { id: 'beef', name: 'Sizzling Beef', emoji: '🥩', categories: ['rice', 'yam', 'banku', 'fries'] },
  { id: 'goat', name: 'Tender Goat Meat', emoji: '🐐', categories: ['rice', 'yam', 'banku'] },
  { id: 'chicken', name: 'Fried/Grilled Chicken', emoji: '🍗', categories: ['rice', 'spaghetti', 'yam', 'banku', 'fries'] },
  { id: 'sausage', name: 'Sausages', emoji: '🌭', categories: ['breakfast', 'rice', 'spaghetti', 'fries'] },
  { id: 'egg', name: 'Boiled/Fried Egg', emoji: '🥚', categories: ['breakfast', 'rice', 'spaghetti', 'yam', 'banku', 'fries'] },
  { id: 'sardines', name: 'Canned Sardines', emoji: '🐟', categories: ['rice', 'yam', 'banku'] },
  { id: 'fried_fish', name: 'Crispy Fried Fish', emoji: '🐟', categories: ['rice', 'yam', 'banku', 'fries'] },
  { id: 'tilapia', name: 'Fried Tilapia', emoji: '🐟', categories: ['banku', 'rice', 'yam'] },
  { id: 'grilled_tilapia', name: 'Grilled Tilapia', emoji: '🐠', categories: ['banku', 'rice', 'yam'] },
  { id: 'gizzard', name: 'Spiced Gizzard', emoji: '🍢', categories: ['rice', 'spaghetti', 'yam', 'banku', 'fries'] }
];

export const SIDE_OPTIONS = [
  // Breakfast extras
  { id: 'bread', name: 'Fresh Soft Bread', emoji: '🍞', categories: ['breakfast'] },
  { id: 'toast', name: 'Golden Toast Slices', emoji: '🍞', categories: ['breakfast'] },
  // Rice/Yam/Banku sides
  { id: 'fried_plantain', name: 'Sweet Fried Plantains (Kelewele)', emoji: '🍌', categories: ['rice', 'yam', 'banku'] },
  { id: 'avocado', name: 'Fresh Avocado Slices', emoji: '🥑', categories: ['rice', 'spaghetti', 'yam', 'banku', 'fries'] },
  { id: 'veggies', name: 'Sautéed Mixed Veggies', emoji: '🥦', categories: ['spaghetti'] },
  // Snack Drink Complements (Beverage Options)
  { id: 'coke', name: 'Coca-Cola (Chilled)', emoji: '🥤', categories: ['snack', 'fries'] },
  { id: 'fanta', name: 'Fanta Orange', emoji: '🍊', categories: ['snack', 'fries'] },
  { id: 'sprite', name: 'Sprite Lemon-Lime', emoji: '🍋', categories: ['snack', 'fries'] },
  { id: 'malt', name: 'Chilled Malt', emoji: '🍺', categories: ['snack', 'fries'] },
  { id: 'water', name: 'Bottled Water', emoji: '💧', categories: ['snack', 'fries'] }
];

export const TOPPING_OPTIONS = [
  { id: 'milk', name: 'Creamy Milk', emoji: '🥛', categories: ['breakfast', 'snack'] },
  { id: 'sugar', name: 'Sweet Sugar', emoji: '🍬', categories: ['breakfast', 'snack'] },
  { id: 'butter', name: 'Spread Butter', emoji: '🧈', categories: ['breakfast'] },
  { id: 'jam', name: 'Fruit Jam', emoji: '🍓', categories: ['breakfast'] },
  { id: 'peanuts', name: 'Crunchy Peanuts', emoji: '🥜', categories: ['snack'] },
  { id: 'chocolate', name: 'Milk Chocolate / Nutella', emoji: '🍫', categories: ['snack', 'breakfast'] }
];
