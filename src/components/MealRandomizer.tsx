import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, RefreshCw, Check, Plus } from 'lucide-react';
import { FoodOption, CustomizedMeal, MealPeriod } from '../types';
import { FOOD_ITEMS, STEW_OPTIONS, PROTEIN_OPTIONS, SIDE_OPTIONS, TOPPING_OPTIONS } from '../data';

interface MealRandomizerProps {
  isOpen: boolean;
  onClose: () => void;
  activePeriod: MealPeriod;
  onAddRandomMealToPlate: (meal: CustomizedMeal) => void;
}

export default function MealRandomizer({
  isOpen,
  onClose,
  activePeriod,
  onAddRandomMealToPlate
}: MealRandomizerProps) {
  if (!isOpen) return null;

  const [period, setPeriod] = useState<MealPeriod>(activePeriod);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  // Slot states
  const [spinningBase, setSpinningBase] = useState<string>('❓');
  const [spinningStew, setSpinningStew] = useState<string>('');
  const [spinningProteins, setSpinningProteins] = useState<string[]>([]);
  const [spinningSides, setSpinningSides] = useState<string[]>([]);

  // Selected Final Results
  const [rolledMeal, setRolledMeal] = useState<CustomizedMeal | null>(null);

  // Trigger roll on mount or when period changes
  useEffect(() => {
    handleRoll();
  }, [period]);

  const handleRoll = () => {
    setIsSpinning(true);
    setRolledMeal(null);
    let counter = 0;
    const intervalTime = 80; // Speed of spin
    const maxTicks = 18; // Number of items spun through

    const timer = setInterval(() => {
      // Pick random items to display during spinning
      const mealsInPeriod = FOOD_ITEMS.filter(m => m.category === period);
      const randomBase = mealsInPeriod[Math.floor(Math.random() * mealsInPeriod.length)];

      if (randomBase) {
        setSpinningBase(`${randomBase.emoji} ${randomBase.name}`);

        const isJollof = randomBase.id.includes('jollof');
        const isFriedYam = randomBase.id === 'fried_yam_dn';

        // Set matching stews/styles if customizable
        if (isJollof) {
          setSpinningStew(Math.random() > 0.5 ? '🥫 with Tomato Stew' : '🌶️ with Pepper Sauce');
        } else if (isFriedYam) {
          setSpinningStew('🌶️ paired with Pepper Sauce');
        } else if (randomBase.customizationType === 'rice' || randomBase.customizationType === 'yam') {
          const randStew = STEW_OPTIONS.filter(s => s.id !== 'pepper_sauce')[Math.floor(Math.random() * (STEW_OPTIONS.length - 1))];
          setSpinningStew(`🥫 with ${randStew.name}`);
        } else if (randomBase.customizationType === 'banku') {
          const randBanku = ['Okro Stew 🍲', 'Tomatoes Stew 🍅', 'Pepper Sauce 🌶️'][Math.floor(Math.random() * 3)];
          setSpinningStew(`🥫 with ${randBanku}`);
        } else if (randomBase.customizationType === 'spaghetti') {
          setSpinningStew(Math.random() > 0.5 ? '🍝 Cooked with Tomato Stew' : '🍳 Veggie & Sausage Stir-fry');
        } else {
          setSpinningStew('');
        }

        // Randomize protein visual
        const randomProteins = PROTEIN_OPTIONS.slice(0, 2).map(p => `${p.emoji} ${p.name}`);
        setSpinningProteins(randomProteins);
      }

      counter++;
      if (counter >= maxTicks) {
        clearInterval(timer);
        finalizeRoll();
      }
    }, intervalTime);
  };

  const finalizeRoll = () => {
    // 1. Get base meal
    const mealsInPeriod = FOOD_ITEMS.filter(m => m.category === period);
    if (mealsInPeriod.length === 0) return;
    const baseMeal = mealsInPeriod[Math.floor(Math.random() * mealsInPeriod.length)];

    // 2. Generate customized options according to precise recipes
    let stew: string | undefined = undefined;
    let bankuSide: 'okro' | 'tomato' | 'pepper-sauce' | undefined = undefined;
    let proteins: string[] = [];
    let sides: string[] = [];
    let toppings: string[] = [];
    let spagStyle: 'stewed' | 'fried' | undefined = undefined;

    const type = baseMeal.customizationType;
    const isJollof = baseMeal.id.includes('jollof');
    const isFriedYam = baseMeal.id === 'fried_yam_dn';
    const isBoiledYam = baseMeal.id === 'boiled_yam_dn';

    if (isJollof) {
      // Jollof gets Tomato Stew or Pepper Sauce, plus proteins/sides
      stew = Math.random() > 0.5 ? 'tomato_stew' : 'pepper_sauce';
      const availableProts = ['chicken', 'beef', 'goat', 'sausage', 'egg', 'fried_fish', 'tilapia', 'grilled_tilapia', 'gizzard'];
      proteins = availableProts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
      sides = ['fried_plantain', 'avocado'].sort(() => 0.5 - Math.random()).slice(0, 1);
    } else if (isFriedYam) {
      // Fried Yam goes with pepper sauce and other protein options
      stew = 'pepper_sauce';
      const availableProts = ['chicken', 'sausage', 'egg', 'fried_fish', 'tilapia', 'grilled_tilapia', 'gizzard'];
      proteins = availableProts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
      sides = ['fried_plantain', 'avocado'].sort(() => 0.5 - Math.random()).slice(0, 1);
    } else if (isBoiledYam) {
      // Boiled Yam goes with stews (tomato, garden egg, kontomire)
      const allowedStews = STEW_OPTIONS.filter(s => s.id !== 'pepper_sauce');
      stew = allowedStews[Math.floor(Math.random() * allowedStews.length)].id;
      const availableProts = ['beef', 'goat', 'chicken', 'egg', 'sardines', 'tilapia', 'grilled_tilapia', 'gizzard'];
      proteins = availableProts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
      sides = ['fried_plantain', 'avocado'].sort(() => 0.5 - Math.random()).slice(0, 1);
    } else if (type === 'rice' || type === 'yam') {
      const stewObj = STEW_OPTIONS[Math.floor(Math.random() * STEW_OPTIONS.length)];
      stew = stewObj.id;

      if (stew === 'pepper_sauce') {
        const availableProts = ['fried_fish', 'chicken', 'gizzard', 'sardines', 'egg', 'tilapia', 'grilled_tilapia'];
        proteins = availableProts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
        sides = ['fried_plantain', 'avocado'].sort(() => 0.5 - Math.random()).slice(0, 1);
      } else {
        const availableProts = ['beef', 'goat', 'chicken', 'sausage', 'egg', 'sardines', 'tilapia', 'grilled_tilapia', 'gizzard'];
        proteins = availableProts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
        sides = ['fried_plantain', 'avocado'].sort(() => 0.5 - Math.random()).slice(0, 1);
      }
    } else if (type === 'spaghetti') {
      spagStyle = Math.random() > 0.5 ? 'stewed' : 'fried';
      if (spagStyle === 'stewed') {
        proteins = [['egg', 'chicken', 'gizzard'][Math.floor(Math.random() * 3)]];
        sides = Math.random() > 0.5 ? ['avocado'] : [];
      } else {
        proteins = [['egg', 'chicken', 'sausage'][Math.floor(Math.random() * 3)]];
        sides = Math.random() > 0.5 ? ['veggies', 'avocado'] : ['veggies'];
      }
    } else if (type === 'banku') {
      const sideOptions: ('okro' | 'tomato' | 'pepper-sauce')[] = ['okro', 'tomato', 'pepper-sauce'];
      bankuSide = sideOptions[Math.floor(Math.random() * sideOptions.length)];

      if (bankuSide === 'okro') {
        proteins = [['beef', 'goat', 'chicken', 'fried_fish', 'tilapia', 'grilled_tilapia'][Math.floor(Math.random() * 6)]];
      } else if (bankuSide === 'tomato') {
        proteins = [['beef', 'goat', 'chicken', 'egg', 'tilapia', 'grilled_tilapia'][Math.floor(Math.random() * 6)]];
      } else {
        proteins = ['fried_fish', 'gizzard', 'chicken', 'egg', 'sardines', 'tilapia', 'grilled_tilapia'].sort(() => 0.5 - Math.random()).slice(0, 2);
        sides = Math.random() > 0.5 ? ['avocado'] : [];
      }
    } else if (type === 'breakfast') {
      sides = [['bread', 'toast'][Math.floor(Math.random() * 2)]];
      toppings = ['milk', 'sugar'].sort(() => 0.5 - Math.random()).slice(0, 2);
      proteins = ['sausage', 'egg'].sort(() => 0.5 - Math.random()).slice(0, 1);
    } else if (type === 'snack') {
      // Snacks do NOT have proteins. They only get drink complements!
      proteins = [];
      const drinkOpts = ['coke', 'fanta', 'sprite', 'malt', 'water'];
      sides = [drinkOpts[Math.floor(Math.random() * drinkOpts.length)]];
      
      if (baseMeal.id === 'blended_kenkey_sn') {
        toppings = ['milk', 'sugar', 'peanuts'];
      } else if (baseMeal.id === 'toast_sn') {
        toppings = ['butter', 'jam', 'chocolate'].sort(() => 0.5 - Math.random()).slice(0, 1);
      }
    }

    const finalMeal: CustomizedMeal = {
      id: Math.random().toString(36).substring(2, 9),
      baseItem: baseMeal,
      selectedStew: stew,
      selectedBankuSide: bankuSide,
      selectedProteins: proteins,
      selectedSides: sides,
      selectedToppings: toppings,
      spaghettiStyle: spagStyle,
      notes: 'Curated by BiteDecide Roller 🎲'
    };

    setSpinningBase(`${baseMeal.emoji} ${baseMeal.name}`);
    if (isJollof) {
      setSpinningStew('✨ Infused Savory Jollof Sauce');
    } else if (stew) {
      setSpinningStew(`🥫 with ${STEW_OPTIONS.find(s => s.id === stew)?.name}`);
    } else if (bankuSide) {
      setSpinningStew(`🥫 with ${bankuSide === 'okro' ? 'Okro Stew' : bankuSide === 'tomato' ? 'Tomatoes Stew' : 'Pepper Sauce'}`);
    } else if (spagStyle) {
      setSpinningStew(`🍝 Style: ${spagStyle === 'stewed' ? 'Tomato Stewed' : 'Veggies & Sausages Stir-fry'}`);
    } else {
      setSpinningStew('');
    }

    // Set real names for protein list
    const realProteins = proteins.map(p => {
      const prot = PROTEIN_OPTIONS.find(x => x.id === p);
      return prot ? `${prot.emoji} ${prot.name}` : p;
    });
    setSpinningProteins(realProteins);

    // Set real names for sides/beverages list
    const realSides = sides.map(s => {
      const sd = SIDE_OPTIONS.find(x => x.id === s);
      return sd ? `${sd.emoji} ${sd.name}` : s;
    });
    setSpinningSides(realSides);

    setRolledMeal(finalMeal);
    setIsSpinning(false);
    setRollCount(prev => prev + 1);
  };

  const handleAddMeal = () => {
    if (rolledMeal) {
      onAddRandomMealToPlate(rolledMeal);
      onClose();
    }
  };

  return (
    <div id="meal-randomizer-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col relative max-h-[90vh] animate-scale-up">
        {/* Header decoration - Sleek dark/emerald green look */}
        <div className="bg-black/50 p-6 text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-zinc-100 text-base sm:text-lg font-brand uppercase tracking-wide">Chef's Choice Roller</h3>
              <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider font-mono">Let BiteDecide build the perfect recipe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-sans">
          {/* Category Quick Select */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block font-mono">
              Which Category to roll?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealPeriod[]).map((p) => (
                <button
                  key={p}
                  id={`randomizer-period-${p}`}
                  onClick={() => !isSpinning && setPeriod(p)}
                  className={`py-2.5 rounded-xl border text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                    period === p
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-black shadow-lg'
                      : 'border-white/5 hover:bg-white/5 text-zinc-200'
                  }`}
                  disabled={isSpinning}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Slot Machine Display */}
          <div className="bg-black/60 rounded-2xl p-6 border border-white/10 relative shadow-inner overflow-hidden flex flex-col items-center justify-center min-h-[190px]">
            {/* Slot background lighting strips */}
            <div className="absolute inset-x-0 h-px bg-emerald-500/10 top-1/4 shadow-lg" />
            <div className="absolute inset-x-0 h-px bg-emerald-500/20 top-2/4 shadow-lg" />
            <div className="absolute inset-x-0 h-px bg-emerald-500/10 top-3/4 shadow-lg" />

            <div className="text-center space-y-3 z-10 w-full">
              {/* Base Food Name */}
              <motion.div
                key={spinningBase}
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg sm:text-xl font-bold text-emerald-400 font-brand tracking-wide drop-shadow-lg"
              >
                {spinningBase}
              </motion.div>

              {/* Stew/Sauce/Style details */}
              {spinningStew && (
                <motion.div
                  key={spinningStew}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-zinc-300 font-semibold font-mono"
                >
                  {spinningStew}
                </motion.div>
              )}

              {/* Protein and Sides tickers */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {spinningProteins.map((p, idx) => (
                  <span key={p + idx} className="text-[10px] bg-white/5 border border-white/10 text-zinc-300 font-bold px-2.5 py-0.5 rounded-full font-mono">
                    {p}
                  </span>
                ))}
                {spinningSides.map((s, idx) => (
                  <span key={s + idx} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Glowing roll indicator light */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500 shadow-lg'}`} />
              <span className="text-[9px] text-zinc-300 font-bold tracking-wider font-mono uppercase">
                {isSpinning ? 'SPINNING' : 'DECIDED'}
              </span>
            </div>
          </div>

          {/* Roll Outcome Presentation Block */}
          {rolledMeal && !isSpinning && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
                  🎉 Curated Combo
                </span>
                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider font-mono">Roll: #{rollCount}</span>
              </div>

              <div>
                <h4 className="font-bold text-zinc-100 text-base flex items-center gap-1.5 font-brand tracking-wide">
                  <span>{rolledMeal.baseItem.emoji}</span>
                  <span>{rolledMeal.baseItem.name}</span>
                </h4>
                <p className="text-zinc-200 text-xs mt-1 leading-relaxed font-medium">
                  {rolledMeal.baseItem.description}
                </p>
              </div>

              <div className="border-t border-emerald-500/20 pt-3 text-xs space-y-1.5 font-medium text-zinc-200">
                {rolledMeal.spaghettiStyle && (
                  <p>
                    Style: <strong className="text-zinc-200 capitalize">{rolledMeal.spaghettiStyle}</strong>
                  </p>
                )}
                {rolledMeal.selectedStew && (
                  <p>
                    Stew: <strong className="text-zinc-200">{STEW_OPTIONS.find(s => s.id === rolledMeal.selectedStew)?.name || rolledMeal.selectedStew}</strong>
                  </p>
                )}
                {rolledMeal.selectedBankuSide && (
                  <p>
                    Side: <strong className="text-zinc-200 capitalize">{rolledMeal.selectedBankuSide.replace('-', ' ')}</strong>
                  </p>
                )}
                {rolledMeal.selectedProteins && rolledMeal.selectedProteins.length > 0 && (
                  <p>
                    Proteins: <strong className="text-zinc-200">{rolledMeal.selectedProteins.map(p => PROTEIN_OPTIONS.find(x => x.id === p)?.name || p).join(', ')}</strong>
                  </p>
                )}
                {rolledMeal.selectedSides && rolledMeal.selectedSides.length > 0 && (
                  <p>
                    {rolledMeal.baseItem.customizationType === 'snack' ? 'Drink' : 'Sides'}: <strong className="text-zinc-200">{rolledMeal.selectedSides.map(s => SIDE_OPTIONS.find(x => x.id === s)?.name || s).join(', ')}</strong>
                  </p>
                )}
                {rolledMeal.selectedToppings && rolledMeal.selectedToppings.length > 0 && (
                  <p>
                    Extras: <strong className="text-emerald-400 font-bold">{rolledMeal.selectedToppings.map(t => TOPPING_OPTIONS.find(x => x.id === t)?.name || t).join(', ')}</strong>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Panel Footer */}
        <div className="p-6 bg-zinc-800/50 backdrop-blur-sm border-t border-white/5 flex gap-3 font-sans">
          <button
            id="re-roll-btn"
            onClick={handleRoll}
            disabled={isSpinning}
            className="flex-1 py-3.5 border border-white/10 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Roll Again</span>
          </button>

          <button
            id="add-rolled-to-plate-btn"
            onClick={handleAddMeal}
            disabled={isSpinning || !rolledMeal}
            className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 shadow-lg cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Plate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
