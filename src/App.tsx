import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Utensils, Info } from 'lucide-react';
import KioskHeader from './components/KioskHeader';
import MenuGrid from './components/MenuGrid';
import CustomizerModal from './components/CustomizerModal';
import MealRandomizer from './components/MealRandomizer';
import OrderSummaryView from './components/OrderSummaryView';
import { FoodOption, CustomizedMeal, SavedPlate, MealPeriod } from './types';
import { FOOD_ITEMS } from './data';

export default function App() {
  // 1. Determine default active period based on the current local time of day
  const getDefaultPeriod = (): MealPeriod => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snacks';
  };

  const [activePeriod, setActivePeriod] = useState<MealPeriod>(getDefaultPeriod());
  const [currentView, setCurrentView] = useState<'menu' | 'summary'>('menu');
  const [selectedMealToCustomize, setSelectedMealToCustomize] = useState<FoodOption | null>(null);
  const [editingMeal, setEditingMeal] = useState<CustomizedMeal | null>(null);
  const [currentPlate, setCurrentPlate] = useState<CustomizedMeal[]>([]);
  const [savedFavorites, setSavedFavorites] = useState<SavedPlate[]>([]);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);

  // 2. Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedPlate = localStorage.getItem('bitedecide_current_plate');
      if (storedPlate) {
        setCurrentPlate(JSON.parse(storedPlate));
      }

      const storedFavorites = localStorage.getItem('bitedecide_favorites');
      if (storedFavorites) {
        setSavedFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error('Failed to load storage data:', e);
    }
  }, []);

  // 3. Save current plate to localStorage when changed
  const updateCurrentPlateState = (newPlate: CustomizedMeal[]) => {
    setCurrentPlate(newPlate);
    try {
      localStorage.setItem('bitedecide_current_plate', JSON.stringify(newPlate));
    } catch (e) {
      console.error('Failed to save plate data:', e);
    }
  };

  // 4. Customizer Add & Modify Handlers
  const handleAddToPlate = (customizedMeal: CustomizedMeal) => {
    const exists = currentPlate.some(m => m.id === customizedMeal.id);
    if (exists) {
      // Modify existing
      const updated = currentPlate.map(m => m.id === customizedMeal.id ? customizedMeal : m);
      updateCurrentPlateState(updated);
    } else {
      // Add new
      updateCurrentPlateState([...currentPlate, customizedMeal]);
    }
    setEditingMeal(null);
    setSelectedMealToCustomize(null);
    setCurrentView('summary');
  };

  const handleEditMeal = (meal: CustomizedMeal) => {
    setEditingMeal(meal);
    setSelectedMealToCustomize(meal.baseItem);
  };

  const handleRemoveMeal = (mealId: string) => {
    const updated = currentPlate.filter(m => m.id !== mealId);
    updateCurrentPlateState(updated);
  };

  const handleClearPlate = () => {
    updateCurrentPlateState([]);
  };

  // 5. Favorites Storage Managers
  const handleSaveFavorite = (name: string) => {
    const newFavorite: SavedPlate = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      meals: [...currentPlate],
      createdAt: new Date().toISOString()
    };
    const updated = [newFavorite, ...savedFavorites];
    setSavedFavorites(updated);
    try {
      localStorage.setItem('bitedecide_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  };

  const handleLoadFavorite = (favorite: SavedPlate) => {
    // Overwrite current plate with the favorite combo meals, generating fresh IDs to avoid duplicate key issues
    const refreshedMeals = favorite.meals.map(m => ({
      ...m,
      id: Math.random().toString(36).substring(2, 9)
    }));
    updateCurrentPlateState(refreshedMeals);
  };

  const handleDeleteFavorite = (id: string) => {
    const updated = savedFavorites.filter(f => f.id !== id);
    setSavedFavorites(updated);
    try {
      localStorage.setItem('bitedecide_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete favorite:', e);
    }
  };

  // Add random meal directly to plate (bypass customized screen)
  const handleAddRandomMealToPlate = (meal: CustomizedMeal) => {
    updateCurrentPlateState([...currentPlate, meal]);
    setCurrentView('summary');
  };

  // Filter food options shown under the active period tab
  const filteredFoodItems = FOOD_ITEMS.filter((item) => item.category === activePeriod);

  return (
    <div id="personal-food-selector-app" className="min-h-screen text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Orbs for dark mode alive feel */}
      
      

      {/* Kiosk Navigation Header */}
      <KioskHeader
        activePeriod={activePeriod}
        onPeriodChange={(p) => setActivePeriod(p)}
        onOpenRandomizer={() => setIsRandomizerOpen(true)}
        cartItemCount={currentPlate.length}
        onViewPlate={() => setCurrentView('summary')}
      />

      {/* Main Body */}
      <main id="kiosk-main-content" className="flex-1 w-full max-w-none px-6 sm:px-10 lg:px-16 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'summary' ? (
            <motion.div key="summary-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <OrderSummaryView 
                cartItems={currentPlate} 
                onBackToMenu={() => setCurrentView('menu')} 
                onRemoveItem={handleRemoveMeal}
              />
            </motion.div>
          ) : (
            <motion.div key="menu-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                {/* Quick Helper Banner */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900/80 backdrop-blur-xl rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-zinc-800/50"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl filter drop-shadow-md">
                      {activePeriod === 'breakfast' && '🍳'}
                      {activePeriod === 'lunch' && '🍚'}
                      {activePeriod === 'dinner' && '🍲'}
                      {activePeriod === 'snacks' && '🍕'}
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block font-mono">
                        Active Session Menu
                      </span>
                      <h3 className="font-bold text-lg sm:text-xl capitalize font-brand tracking-wide text-white mt-0.5">
                        {activePeriod} Selection
                      </h3>
                      <p className="text-xs text-zinc-200 mt-1 max-w-md leading-relaxed font-medium">
                        Configure your recipe with fresh local stews, high-grade proteins (sausages, chicken, fish, eggs) and healthy complements.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Menu Grid */}
                <MenuGrid
                  items={filteredFoodItems}
                  onSelectMeal={(meal) => {
                    setEditingMeal(null);
                    setSelectedMealToCustomize(meal);
                  }}
                />

                {/* General Customization Guidelines Disclaimer */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel p-5 rounded-[24px] flex items-start gap-4 shadow-xl"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-zinc-300 leading-relaxed font-medium font-sans">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block mb-1 font-mono">Dietary Combinations & Pairing Rules</span>
                    All selections strictly respect customized kitchen rules. Base dishes load matching stews automatically (e.g. Garden Eggs stew, Tomatoes reduction, or Shito green pepper sauce). High-grade proteins like grilled sausages, crisp chicken thighs, fried sardines or spiced gizzards can be layered per selection.
                  </div>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Step Customizer sliding Drawer Modal */}
      {selectedMealToCustomize && (
        <CustomizerModal
          meal={selectedMealToCustomize}
          onClose={() => {
            setSelectedMealToCustomize(null);
            setEditingMeal(null);
          }}
          onAddToPlate={handleAddToPlate}
          existingCustomization={editingMeal}
        />
      )}

      {/* Roll The Dice Randomizer Modal Overlay */}
      <MealRandomizer
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
        activePeriod={activePeriod}
        onAddRandomMealToPlate={handleAddRandomMealToPlate}
      />
    </div>
  );
}
