import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShoppingBag, ArrowRight, Sparkles, Coffee } from 'lucide-react';
import { FoodOption, CustomizedMeal } from '../types';
import { STEW_OPTIONS, PROTEIN_OPTIONS, SIDE_OPTIONS, TOPPING_OPTIONS } from '../data';

interface CustomizerModalProps {
  meal: FoodOption | null;
  onClose: () => void;
  onAddToPlate: (customized: CustomizedMeal) => void;
  existingCustomization?: CustomizedMeal | null; // For editing
}

export default function CustomizerModal({
  meal,
  onClose,
  onAddToPlate,
  existingCustomization
}: CustomizerModalProps) {
  if (!meal) return null;

  const isSnack = meal.customizationType === 'snack';
  const isJollof = meal.id.includes('jollof');
  const isFriedYam = meal.id === 'fried_yam_dn';
  const isBoiledYam = meal.id === 'boiled_yam_dn';

  // State variables for customization steps
  const [selectedStew, setSelectedStew] = useState<string>('');
  const [selectedBankuSide, setSelectedBankuSide] = useState<'okro' | 'tomato' | 'pepper-sauce'>('okro');
  const [selectedProteins, setSelectedProteins] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [spaghettiStyle, setSpaghettiStyle] = useState<'stewed' | 'fried'>('stewed');
  const [notes, setNotes] = useState<string>('');

  // Step wizard tracking (for customizer tabs)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);

  // Initialize from existing customization if editing
  useEffect(() => {
    if (existingCustomization) {
      setSelectedStew(existingCustomization.selectedStew || '');
      setSelectedBankuSide(existingCustomization.selectedBankuSide || 'okro');
      setSelectedProteins(existingCustomization.selectedProteins || []);
      setSelectedSides(existingCustomization.selectedSides || []);
      setSelectedToppings(existingCustomization.selectedToppings || []);
      setSpaghettiStyle(existingCustomization.spaghettiStyle || 'stewed');
      setNotes(existingCustomization.notes || '');
    } else {
      // Default setup based on customization rules
      if (isFriedYam) {
        setSelectedStew('pepper_sauce'); // Fried Yam ALWAYS gets Pepper Sauce
      } else if (isBoiledYam) {
        setSelectedStew('tomato_stew'); // Default stew for Boiled Yam
      } else if (isJollof) {
        setSelectedStew('tomato_stew'); // Default stew for Jollof
      } else if (meal.customizationType === 'rice') {
        setSelectedStew('tomato_stew'); // Default for other rices
      } else if (meal.customizationType === 'banku') {
        setSelectedBankuSide('okro');
      } else if (meal.customizationType === 'spaghetti') {
        setSpaghettiStyle('stewed');
      }
      setSelectedProteins([]);
      setSelectedSides([]);
      setSelectedToppings([]);
      setNotes('');
    }
    setActiveStep(1);
  }, [meal, existingCustomization]);

  // Handle switching stews or styles: Auto-reset incompatible proteins to prevent bad user states
  const handleStewChange = (stewId: string) => {
    setSelectedStew(stewId);
    setSelectedProteins([]);
  };

  const handleBankuSideChange = (side: 'okro' | 'tomato' | 'pepper-sauce') => {
    setSelectedBankuSide(side);
    setSelectedProteins([]);
  };

  const handleSpaghettiStyleChange = (style: 'stewed' | 'fried') => {
    setSpaghettiStyle(style);
    setSelectedProteins([]);
    setSelectedSides([]);
  };

  // Toggle multiple options
  const toggleProtein = (proteinId: string) => {
    setSelectedProteins(prev =>
      prev.includes(proteinId) ? prev.filter(p => p !== proteinId) : [...prev, proteinId]
    );
  };

  const toggleSide = (sideId: string) => {
    setSelectedSides(prev =>
      prev.includes(sideId) ? prev.filter(s => s !== sideId) : [...prev, sideId]
    );
  };

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings(prev =>
      prev.includes(toppingId) ? prev.filter(t => t !== toppingId) : [...prev, toppingId]
    );
  };

  // --- FILTERED SELECTION LOGIC ---
  const getFilteredProteins = () => {
    const type = meal.customizationType;

    if (isJollof) {
      // Jollof can be customized with any lunch/dinner proteins
      return PROTEIN_OPTIONS.filter(p => ['chicken', 'beef', 'goat', 'sausage', 'egg', 'fried_fish', 'tilapia', 'grilled_tilapia', 'gizzard'].includes(p.id));
    }

    if (isFriedYam) {
      // Fried Yam goes with pepper sauce and other proteins
      return PROTEIN_OPTIONS.filter(p => ['chicken', 'sausage', 'egg', 'fried_fish', 'tilapia', 'grilled_tilapia', 'gizzard'].includes(p.id));
    }

    if (isBoiledYam) {
      // Boiled Yam goes with stews (and matching proteins)
      return PROTEIN_OPTIONS.filter(p => ['beef', 'goat', 'chicken', 'egg', 'sardines', 'tilapia', 'grilled_tilapia', 'gizzard'].includes(p.id));
    }

    if (type === 'rice') {
      if (selectedStew === 'pepper_sauce') {
        return PROTEIN_OPTIONS.filter(p => ['fried_fish', 'chicken', 'gizzard', 'sardines', 'egg', 'tilapia', 'grilled_tilapia'].includes(p.id));
      } else {
        return PROTEIN_OPTIONS.filter(p => ['beef', 'goat', 'chicken', 'sausage', 'egg', 'sardines', 'gizzard', 'tilapia', 'grilled_tilapia'].includes(p.id));
      }
    }

    if (type === 'spaghetti') {
      if (spaghettiStyle === 'stewed') {
        return PROTEIN_OPTIONS.filter(p => ['egg', 'chicken', 'gizzard'].includes(p.id));
      } else {
        return PROTEIN_OPTIONS.filter(p => ['egg', 'chicken', 'sausage'].includes(p.id));
      }
    }

    if (type === 'banku') {
      if (selectedBankuSide === 'okro') {
        return PROTEIN_OPTIONS.filter(p => ['beef', 'goat', 'chicken', 'fried_fish', 'tilapia', 'grilled_tilapia'].includes(p.id));
      } else if (selectedBankuSide === 'tomato') {
        return PROTEIN_OPTIONS.filter(p => ['beef', 'goat', 'chicken', 'egg', 'sausage', 'gizzard', 'tilapia', 'grilled_tilapia'].includes(p.id));
      } else {
        return PROTEIN_OPTIONS.filter(p => ['fried_fish', 'gizzard', 'chicken', 'egg', 'sardines', 'tilapia', 'grilled_tilapia'].includes(p.id));
      }
    }

    if (type === 'breakfast') {
      return PROTEIN_OPTIONS.filter(p => ['sausage', 'egg'].includes(p.id));
    }

    if (type === 'fries') {
      return PROTEIN_OPTIONS.filter(p => ['beef', 'chicken', 'sausage', 'egg', 'fried_fish', 'gizzard'].includes(p.id));
    }

    return [];
  };

  const getFilteredSides = () => {
    const type = meal.customizationType;

    if (isSnack) {
      // Snacks do NOT have protein tabs or general sides. They only get beverages!
      return SIDE_OPTIONS.filter(s => ['coke', 'fanta', 'sprite', 'malt', 'water'].includes(s.id));
    }

    if (isJollof || type === 'rice' || isBoiledYam || isFriedYam) {
      return SIDE_OPTIONS.filter(s => ['fried_plantain', 'avocado'].includes(s.id));
    }

    if (type === 'spaghetti') {
      if (spaghettiStyle === 'stewed') {
        return SIDE_OPTIONS.filter(s => ['avocado'].includes(s.id));
      } else {
        return SIDE_OPTIONS.filter(s => ['veggies', 'avocado'].includes(s.id));
      }
    }

    if (type === 'banku') {
      if (selectedBankuSide === 'pepper-sauce') {
        return SIDE_OPTIONS.filter(s => ['avocado', 'fried_plantain'].includes(s.id));
      }
      return SIDE_OPTIONS.filter(s => ['avocado'].includes(s.id));
    }

    if (type === 'breakfast') {
      return SIDE_OPTIONS.filter(s => ['bread', 'toast'].includes(s.id));
    }

    if (type === 'fries') {
      return SIDE_OPTIONS.filter(s => ['avocado', 'coke', 'fanta', 'sprite', 'malt', 'water'].includes(s.id));
    }

    return [];
  };

  const getFilteredToppings = () => {
    const type = meal.customizationType;

    if (type === 'breakfast') {
      return TOPPING_OPTIONS.filter(t => ['milk', 'sugar', 'butter', 'jam', 'chocolate'].includes(t.id));
    }

    if (isSnack) {
      if (meal.id === 'blended_kenkey_sn') {
        return TOPPING_OPTIONS.filter(t => ['milk', 'sugar', 'peanuts', 'chocolate'].includes(t.id));
      }
      if (meal.id === 'toast_sn') {
        return TOPPING_OPTIONS.filter(t => ['butter', 'jam', 'chocolate'].includes(t.id));
      }
    }

    return [];
  };

  const handleConfirm = () => {
    setIsCelebrating(true);
    setTimeout(() => {
      const customized: CustomizedMeal = {
        id: existingCustomization?.id || Math.random().toString(36).substring(2, 9),
        baseItem: meal,
        selectedStew: (meal.customizationType === 'rice' || meal.customizationType === 'yam') ? selectedStew : undefined,
        selectedBankuSide: meal.customizationType === 'banku' ? selectedBankuSide : undefined,
        selectedProteins: isSnack ? [] : selectedProteins, // Snacks don't have proteins
        selectedSides,
        selectedToppings,
        spaghettiStyle: meal.customizationType === 'spaghetti' ? spaghettiStyle : undefined,
        notes
      };
      onAddToPlate(customized);
      onClose();
    }, 2500);
  };

  const filteredProteins = getFilteredProteins();
  const filteredSides = getFilteredSides();
  const filteredToppings = getFilteredToppings();

  // Dynamic steps based on snack vs standard meal
  const steps = isSnack ? [
    { number: 1, label: 'Sweeteners & Toppings' },
    { number: 2, label: 'Add a Chilled Drink' }
  ] : [
    { number: 1, label: 'Choose Sauce/Style' },
    { number: 2, label: 'Add Proteins' },
    { number: 3, label: 'Sides & Extras' }
  ];

  return (
    <AnimatePresence mode="wait">
      {isCelebrating ? (
        <motion.div
          key="celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] flex items-center justify-center mb-8"
          >
             <motion.div 
              className="absolute inset-0 rounded-full border-[16px] border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.3)] overflow-hidden bg-zinc-900"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover opacity-100" />
            </motion.div>
            <motion.div className="relative z-10 text-[180px] filter drop-shadow-2xl">
              {meal.emoji}
            </motion.div>
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl sm:text-6xl font-black text-emerald-400 font-brand tracking-widest drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          >
            DELICIOUS CHOICE!
          </motion.h2>
        </motion.div>
      ) : (
      <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} id="customizer-modal-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
        {/* Visual Rotating Plate Preview (Desktop Only) */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 overflow-hidden relative">
          <div className="relative w-[450px] h-[450px] flex items-center justify-center">
            {/* The Plate Base */}
            <motion.div 
              className="absolute inset-0 rounded-full border-[12px] border-zinc-800/90 shadow-2xl overflow-hidden bg-zinc-900"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Orbiting Selected Items */}
            {[
              ...selectedProteins.map(id => PROTEIN_OPTIONS.find(p => p.id === id)?.emoji),
              ...selectedSides.map(id => SIDE_OPTIONS.find(s => s.id === id)?.emoji),
              ...selectedToppings.map(id => TOPPING_OPTIONS.find(t => t.id === id)?.emoji),
            ].filter(Boolean).map((emoji, idx, arr) => {
              const angle = (idx / arr.length) * Math.PI * 2;
              const radius = 250; // Radius slightly outside the plate
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={`${emoji}-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute z-20 text-7xl bg-zinc-800 border-2 border-zinc-700 rounded-full w-28 h-28 flex items-center justify-center shadow-2xl"
                  style={{ x, y }}
                >
                  {emoji}
                </motion.div>
              );
            })}

            {/* Meal Base Emoji in the center */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10 text-9xl filter drop-shadow-2xl"
            >
              {meal.emoji}
            </motion.div>
          </div>
        </div>

        {/* Slide-over customizer panel with modern Bolt Food feel */}
        <motion.div
          id="customizer-panel"
          initial={{ x: '100%', opacity: 0.95 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="w-full max-w-lg bg-zinc-900 h-full flex flex-col shadow-2xl relative border-l border-white/10 font-sans"
        >
          {/* Header Image Background with Elegant Design */}
          <div className="relative h-44 sm:h-48 bg-zinc-800 flex-shrink-0 overflow-hidden">
            <img 
              src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'} 
              alt={meal.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Header text content */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                {meal.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-brand tracking-wide mt-1.5 flex items-center gap-2">
                <span>{meal.name}</span>
                <span className="text-xl sm:text-2xl">{meal.emoji}</span>
              </h3>
              <p className="text-xs text-neutral-200 mt-1 line-clamp-2 leading-relaxed">
                {meal.description}
              </p>
            </div>

            {/* Close Button overlay */}
            <button
              id="close-customizer-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/45 hover:bg-black/60 text-white transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps Tab Bar */}
          <div className="bg-zinc-900 px-6 py-3 border-b border-white/10 flex justify-between items-center text-xs flex-shrink-0">
            {steps.map((s) => (
              <button
                key={s.number}
                id={`step-indicator-${s.number}`}
                onClick={() => setActiveStep(s.number)}
                className={`flex items-center gap-2 pb-1.5 border-b-2 font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                  activeStep === s.number
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-zinc-300 hover:text-zinc-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeStep === s.number ? 'bg-emerald-500 text-white shadow-sm' : 'bg-zinc-800 text-zinc-200'
                }`}>
                  {s.number}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-mono">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Customizer Option Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-800/50">
            <AnimatePresence mode="wait">
              {/* --- STEP 1 --- */}
              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Jollof Rice Special Notice */}
                  {isJollof && (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                        <h4 className="font-bold text-sm">Savory Smoky Jollof</h4>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                        Our Jollof Rice is slow-cooked in rich spices. You can customize your meal by choosing to add either Tomato Stew or Pepper Sauce as your stew/sauce base.
                      </p>
                    </div>
                  )}

                  {/* Fried Yam Special Preselection */}
                  {isFriedYam && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                          <h4 className="font-bold text-sm">Fried Yam & Pepper Sauce</h4>
                        </div>
                        <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                          Golden crispy fried yam is traditionally paired with our signature spicy red/green Pepper Sauce. This sauce is automatically preselected for you to ensure the perfect match!
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl border border-emerald-500 bg-emerald-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌶️</span>
                          <div>
                            <p className="font-bold text-sm text-emerald-700">Pepper Sauce (Included)</p>
                            <p className="text-[11px] text-zinc-300 mt-0.5 font-medium">Spicy fresh pepper paste, hot & savory.</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-zinc-900 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                          Preselected
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Boiled Yam Stew Selection */}
                  {isBoiledYam && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                        Select Stew Base <span className="text-emerald-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {STEW_OPTIONS.filter(s => s.id !== 'pepper_sauce').map((stew) => {
                          const isSelected = selectedStew === stew.id;
                          return (
                            <button
                              key={stew.id}
                              id={`stew-choice-${stew.id}`}
                              onClick={() => handleStewChange(stew.id)}
                              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                  : 'border-white/10 bg-zinc-900 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{stew.emoji}</span>
                                <div>
                                  <p className={`font-bold text-sm ${isSelected ? 'text-emerald-600' : 'text-[#1A1816]'}`}>
                                    {stew.name}
                                  </p>
                                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-medium">{stew.description}</p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Standard Rice/Other Sauce Selection */}
                  {!isFriedYam && !isBoiledYam && (meal.customizationType === 'rice') && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                        Select Stew or Sauce Base <span className="text-emerald-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {STEW_OPTIONS.filter(stew => !isJollof || ['tomato_stew', 'pepper_sauce'].includes(stew.id)).map((stew) => {
                          const isSelected = selectedStew === stew.id;
                          return (
                            <button
                              key={stew.id}
                              id={`stew-choice-${stew.id}`}
                              onClick={() => handleStewChange(stew.id)}
                              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                  : 'border-white/10 bg-zinc-900 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{stew.emoji}</span>
                                <div>
                                  <p className={`font-bold text-sm ${isSelected ? 'text-emerald-600' : 'text-[#1A1816]'}`}>
                                    {stew.name}
                                  </p>
                                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-medium">{stew.description}</p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Banku Side choices */}
                  {meal.customizationType === 'banku' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                        Select Soup or Sauce Base <span className="text-emerald-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          id="banku-side-okro"
                          onClick={() => handleBankuSideChange('okro')}
                          className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                            selectedBankuSide === 'okro'
                              ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                              : 'border-white/10 bg-zinc-900 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🍲</span>
                            <div>
                              <p className={`font-bold text-sm ${selectedBankuSide === 'okro' ? 'text-emerald-600' : 'text-[#1A1816]'}`}>
                                Okro Stew (Traditional)
                              </p>
                              <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-medium">Rich okra, meat, fish and palm oil reduction.</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedBankuSide === 'okro' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                          }`}>
                            {selectedBankuSide === 'okro' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>

                        <button
                          id="banku-side-tomato"
                          onClick={() => handleBankuSideChange('tomato')}
                          className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                            selectedBankuSide === 'tomato'
                              ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                              : 'border-white/10 bg-zinc-900 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🍅</span>
                            <div>
                              <p className={`font-bold text-sm ${selectedBankuSide === 'tomato' ? 'text-emerald-600' : 'text-[#1A1816]'}`}>
                                Tomatoes Stew
                              </p>
                              <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-medium">Savory tomato, onion sauce. Extra meat choices available next.</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedBankuSide === 'tomato' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                          }`}>
                            {selectedBankuSide === 'tomato' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>

                        <button
                          id="banku-side-pepper"
                          onClick={() => handleBankuSideChange('pepper-sauce')}
                          className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                            selectedBankuSide === 'pepper-sauce'
                              ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                              : 'border-white/10 bg-zinc-900 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🌶️</span>
                            <div>
                              <p className={`font-bold text-sm ${selectedBankuSide === 'pepper-sauce' ? 'text-emerald-600' : 'text-[#1A1816]'}`}>
                                Spicy Pepper Sauce
                              </p>
                              <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-medium">Spicy green chili/shito with fried proteins next.</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedBankuSide === 'pepper-sauce' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                          }`}>
                            {selectedBankuSide === 'pepper-sauce' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Spaghetti Style choices */}
                  {meal.customizationType === 'spaghetti' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                        Spaghetti Cooking Style <span className="text-emerald-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          id="spaghetti-style-stewed"
                          onClick={() => handleSpaghettiStyleChange('stewed')}
                          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                            spaghettiStyle === 'stewed'
                              ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                              : 'border-white/10 bg-zinc-900 hover:border-white/10'
                          }`}
                        >
                          <span className="text-2xl block mb-1">🍝</span>
                          <p className="font-bold text-sm text-zinc-200">Spaghetti & Stew</p>
                          <p className="text-[10px] text-zinc-300 mt-1">Paired with rich tomatoes stew</p>
                        </button>

                        <button
                          id="spaghetti-style-fried"
                          onClick={() => handleSpaghettiStyleChange('fried')}
                          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                            spaghettiStyle === 'fried'
                              ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                              : 'border-white/10 bg-zinc-900 hover:border-white/10'
                          }`}
                        >
                          <span className="text-2xl block mb-1">🍳</span>
                          <p className="font-bold text-sm text-zinc-200">Fried Spaghetti</p>
                          <p className="text-[10px] text-zinc-300 mt-1">Stir-fried veggies & sausage</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Breakfast Extra Spread / Toppings Option for Step 1 */}
                  {meal.customizationType === 'breakfast' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-xs text-emerald-800 leading-relaxed font-medium flex gap-3">
                        <Coffee className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <strong>Breakfast:</strong> Choose sweeteners or spreads next to customize your healthy start!
                        </div>
                      </div>

                      {filteredToppings.length > 0 && (
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                            Quick Spreads & Porridge Sweeteners
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            {filteredToppings.map((topping) => {
                              const isSelected = selectedToppings.includes(topping.id);
                              return (
                                <button
                                  key={topping.id}
                                  id={`topping-opt-${topping.id}`}
                                  onClick={() => toggleTopping(topping.id)}
                                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                    isSelected
                                      ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                      : 'border-white/10 bg-zinc-900 hover:border-white/10'
                                  }`}
                                >
                                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                                    <span className="text-xl filter drop-shadow-sm">{topping.emoji}</span>
                                    <span>{topping.name}</span>
                                  </span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                                  }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fries notice in Step 1 */}
                  {meal.customizationType === 'fries' && (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                        <h4 className="font-bold text-sm">Crispy Fries</h4>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                        Our fries come perfectly salted and crispy. No sauce required! Click "Next" to add your favorite proteins.
                      </p>
                    </div>
                  )}

                  {/* Snack Toppings Panel in Step 1 */}
                  {isSnack && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-xs text-emerald-800 leading-relaxed font-medium">
                        🍕 Customizing Snack toppings! Add premium spreads, sweeteners or extra toppings to your snack order.
                      </div>

                      {filteredToppings.length > 0 ? (
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                            Add Premium Sweeteners & Extras
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            {filteredToppings.map((topping) => {
                              const isSelected = selectedToppings.includes(topping.id);
                              return (
                                <button
                                  key={topping.id}
                                  id={`topping-opt-${topping.id}`}
                                  onClick={() => toggleTopping(topping.id)}
                                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                    isSelected
                                      ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                      : 'border-white/10 bg-zinc-900 hover:border-white/10'
                                  }`}
                                >
                                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                                    <span className="text-xl filter drop-shadow-sm">{topping.emoji}</span>
                                    <span>{topping.name}</span>
                                  </span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                                  }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-300 italic font-medium">No specialized toppings needed. Ready to proceed to cold beverage selections!</p>
                      )}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      id="next-step-1"
                      onClick={() => setActiveStep(2)}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-lg shadow-emerald-100"
                    >
                      <span>Proceed to {isSnack ? 'Drinks' : 'Proteins'}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 2 --- */}
              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Snack - Step 2 is Drinks Selection */}
                  {isSnack ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                          Add a Chilled Beverage <span className="text-zinc-300 font-normal">(Pick multiple options)</span>
                        </label>
                        <p className="text-[10px] text-emerald-700/80 mt-1 font-bold">
                          ★ Complete your snack with a refreshing local or classic soft drink!
                        </p>
                      </div>

                      {filteredSides.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {filteredSides.map((drink) => {
                            const isSelected = selectedSides.includes(drink.id);
                            return (
                              <button
                                key={drink.id}
                                id={`side-opt-${drink.id}`}
                                onClick={() => toggleSide(drink.id)}
                                className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                  isSelected
                                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                    : 'border-white/10 bg-zinc-900 hover:border-white/10'
                                }`}
                              >
                                <span className="text-xs font-bold text-zinc-200 flex items-center gap-3">
                                  <span className="text-2xl filter drop-shadow-sm">{drink.emoji}</span>
                                  <span>{drink.name}</span>
                                </span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                  isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                                }`}>
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Custom Prep Notes for Snacks */}
                      <div className="space-y-2 pt-3">
                        <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                          Special Instructions / Preparation
                        </label>
                        <textarea
                          id="custom-cooking-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. make it extra toasted, split in two, chill the drinks..."
                          className="w-full text-xs p-3.5 rounded-2xl border border-white/10 bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[75px] resize-none font-medium text-neutral-700"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          id="back-to-step-1"
                          onClick={() => setActiveStep(1)}
                          className="flex-1 py-3.5 bg-zinc-800 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                        >
                          Back
                        </button>
                        <button
                          id="confirm-snack-customization"
                          onClick={handleConfirm}
                          className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-100 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{existingCustomization ? 'Save Changes' : 'Add Snack to Plate'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Standard Meal - Step 2 is Proteins Selection
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                          Choose Protein Add-ons <span className="text-zinc-300 font-normal">(Pick multiple options)</span>
                        </label>
                        <p className="text-[10px] text-emerald-700/80 mt-1 font-bold">
                          {isFriedYam
                            ? '★ Freshly prepared proteins to pair with crisp fried yams!'
                            : '★ Roasted and grilled options curated for your dish!'}
                        </p>
                      </div>

                      {filteredProteins.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          {filteredProteins.map((protein) => {
                            const isSelected = selectedProteins.includes(protein.id);
                            return (
                              <button
                                key={protein.id}
                                id={`protein-opt-${protein.id}`}
                                onClick={() => toggleProtein(protein.id)}
                                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                  isSelected
                                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                    : 'border-white/10 bg-zinc-900 hover:border-white/10'
                                }`}
                              >
                                <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                                  <span className="text-xl filter drop-shadow-sm">{protein.emoji}</span>
                                  <span>{protein.name}</span>
                                </span>
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                  isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                                }`}>
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-300 italic font-medium">No custom protein options available for this item.</p>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          id="back-to-step-1"
                          onClick={() => setActiveStep(1)}
                          className="flex-1 py-3.5 bg-zinc-800 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                        >
                          Back
                        </button>
                        <button
                          id="next-step-2"
                          onClick={() => setActiveStep(3)}
                          className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-lg shadow-emerald-100"
                        >
                          <span>Sides & Extras</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- STEP 3 --- */}
              {activeStep === 3 && !isSnack && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Sides section */}
                  {filteredSides.length > 0 && (
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                        Select Sides & Complements
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {filteredSides.map((side) => {
                          const isSelected = selectedSides.includes(side.id);
                          return (
                            <button
                              key={side.id}
                              id={`side-opt-${side.id}`}
                              onClick={() => toggleSide(side.id)}
                              className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                  : 'border-white/10 bg-zinc-900 hover:border-white/10'
                              }`}
                            >
                              <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                                <span className="text-xl filter drop-shadow-sm">{side.emoji}</span>
                                <span>{side.name}</span>
                              </span>
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Toppings section (Breakfast milk/sugar if not shown on step 1) */}
                  {filteredToppings.length > 0 && meal.customizationType !== 'breakfast' && (
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                        Add Sweeteners, Spreads & Extras
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {filteredToppings.map((topping) => {
                          const isSelected = selectedToppings.includes(topping.id);
                          return (
                            <button
                              key={topping.id}
                              id={`topping-opt-${topping.id}`}
                              onClick={() => toggleTopping(topping.id)}
                              className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/10'
                                  : 'border-white/10 bg-zinc-900 hover:border-white/10'
                              }`}
                            >
                              <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                                <span className="text-xl filter drop-shadow-sm">{topping.emoji}</span>
                                <span>{topping.name}</span>
                              </span>
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-zinc-900'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Prep Notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
                      Cooking Notes / Special Instructions
                    </label>
                    <textarea
                      id="custom-cooking-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. less spicy sauce, crispy fried plantains, slice avocado..."
                      className="w-full text-xs p-3.5 rounded-2xl border border-white/10 bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[75px] resize-none font-medium text-neutral-700"
                    />
                  </div>

                  {/* Action row */}
                  <div className="flex gap-3 pt-2">
                    <button
                      id="back-to-step-2"
                      onClick={() => setActiveStep(2)}
                      className="flex-1 py-3.5 bg-zinc-800 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                    >
                      Back
                    </button>
                    <button
                      id="confirm-meal-customization"
                      onClick={handleConfirm}
                      className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-100 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{existingCustomization ? 'Save Changes' : 'Add to Plate'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
