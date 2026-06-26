import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';
import KioskHeader from './components/KioskHeader';
import MenuGrid from './components/MenuGrid';
import CustomizerModal from './components/CustomizerModal';
import MealRandomizer from './components/MealRandomizer';
import OrderSummaryView from './components/OrderSummaryView';
import HistoryView from './components/HistoryView';
import AuthModal from './components/AuthModal';
import { FoodOption, CustomizedMeal, MealPeriod } from './types';
import { FOOD_ITEMS } from './data';
import { supabase } from './lib/supabase';

export default function App() {
  const getDefaultPeriod = (): MealPeriod => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snacks';
  };

  const [activePeriod, setActivePeriod] = useState<MealPeriod>(getDefaultPeriod());
  const [currentView, setCurrentView] = useState<'menu' | 'summary' | 'history'>('menu');
  const [selectedMealToCustomize, setSelectedMealToCustomize] = useState<FoodOption | null>(null);
  const [editingMeal, setEditingMeal] = useState<CustomizedMeal | null>(null);
  const [currentPlate, setCurrentPlate] = useState<CustomizedMeal[]>([]);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);
  
  // Auth state
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFinishingOrder, setIsFinishingOrder] = useState(false);
  const [pendingView, setPendingView] = useState<'summary' | 'history' | null>(null);

  // Check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSessionUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load current plate from local storage
  useEffect(() => {
    try {
      const storedPlate = localStorage.getItem('bitedecide_current_plate');
      if (storedPlate) {
        setCurrentPlate(JSON.parse(storedPlate));
      }
    } catch (e) {
      console.error('Failed to load storage data:', e);
    }
  }, []);

  const updateCurrentPlateState = (newPlate: CustomizedMeal[]) => {
    setCurrentPlate(newPlate);
    try {
      localStorage.setItem('bitedecide_current_plate', JSON.stringify(newPlate));
    } catch (e) {
      console.error('Failed to save plate data:', e);
    }
  };

  const handleAddToPlate = (customizedMeal: CustomizedMeal) => {
    const exists = currentPlate.some(m => m.id === customizedMeal.id);
    if (exists) {
      const updated = currentPlate.map(m => m.id === customizedMeal.id ? customizedMeal : m);
      updateCurrentPlateState(updated);
    } else {
      updateCurrentPlateState([...currentPlate, customizedMeal]);
    }
    setEditingMeal(null);
    setSelectedMealToCustomize(null);
    setCurrentView('summary');
  };

  const handleRemoveMeal = (mealId: string) => {
    const updated = currentPlate.filter(m => m.id !== mealId);
    updateCurrentPlateState(updated);
  };

  const handleAddRandomMealToPlate = (meal: CustomizedMeal) => {
    updateCurrentPlateState([...currentPlate, meal]);
    setCurrentView('summary');
  };

  const handleFinishOrder = async () => {
    if (!sessionUser) {
      setIsFinishingOrder(true);
      setIsAuthModalOpen(true);
      return;
    }
    await savePlateToSupabase();
  };

  const savePlateToSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const plateName = `Order on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      const { error } = await supabase.from('saved_plates').insert({
        user_id: user.id,
        name: plateName,
        meals: currentPlate
      });
      
      if (error) throw error;
      
      updateCurrentPlateState([]);
      setCurrentView('history');
      setIsFinishingOrder(false);
    } catch (err: any) {
      alert("Failed to save order: " + err.message);
    }
  };

  const handleLoginSuccess = () => {
    if (isFinishingOrder) {
      savePlateToSupabase();
      setIsFinishingOrder(false);
    } else if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    }
  };

  const filteredFoodItems = FOOD_ITEMS.filter((item) => item.category === activePeriod);

  return (
    <div id="personal-food-selector-app" className="min-h-screen text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      <KioskHeader
        activePeriod={activePeriod}
        onPeriodChange={(p) => setActivePeriod(p)}
        onOpenRandomizer={() => setIsRandomizerOpen(true)}
        cartItemCount={currentPlate.length}
        onViewPlate={() => {
          if (!sessionUser) {
            setPendingView('summary');
            setIsFinishingOrder(false);
            setIsAuthModalOpen(true);
          } else {
            setCurrentView('summary');
          }
        }}
        onViewHistory={() => {
          if (!sessionUser) {
            setPendingView('history');
            setIsFinishingOrder(false);
            setIsAuthModalOpen(true);
          } else {
            setCurrentView('history');
          }
        }}
        sessionUser={sessionUser}
        onLogout={() => supabase.auth.signOut()}
      />

      <main id="kiosk-main-content" className="flex-1 w-full max-w-none px-6 sm:px-10 lg:px-16 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'history' ? (
             <motion.div key="history-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <HistoryView onBackToMenu={() => setCurrentView('menu')} />
             </motion.div>
          ) : currentView === 'summary' ? (
            <motion.div key="summary-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <OrderSummaryView 
                cartItems={currentPlate} 
                onBackToMenu={() => setCurrentView('menu')} 
                onRemoveItem={handleRemoveMeal}
                onFinishOrder={handleFinishOrder}
              />
            </motion.div>
          ) : (
            <motion.div key="menu-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
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

                <MenuGrid
                  items={filteredFoodItems}
                  onSelectMeal={(meal) => {
                    setEditingMeal(null);
                    setSelectedMealToCustomize(meal);
                  }}
                />

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

      <MealRandomizer
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
        activePeriod={activePeriod}
        onAddRandomMealToPlate={handleAddRandomMealToPlate}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
