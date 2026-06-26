import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Edit, Heart, BookOpen, Printer, Check, Copy, RefreshCw, Star } from 'lucide-react';
import { CustomizedMeal, SavedPlate } from '../types';
import { STEW_OPTIONS, PROTEIN_OPTIONS, SIDE_OPTIONS, TOPPING_OPTIONS } from '../data';

interface PlateSummaryProps {
  currentPlate: CustomizedMeal[];
  onEditMeal: (meal: CustomizedMeal) => void;
  onRemoveMeal: (mealId: string) => void;
  onClearPlate: () => void;
  savedFavorites: SavedPlate[];
  onSaveFavorite: (name: string) => void;
  onLoadFavorite: (favorite: SavedPlate) => void;
  onDeleteFavorite: (id: string) => void;
}

export default function PlateSummary({
  currentPlate,
  onEditMeal,
  onRemoveMeal,
  onClearPlate,
  savedFavorites,
  onSaveFavorite,
  onLoadFavorite,
  onDeleteFavorite
}: PlateSummaryProps) {
  const [favoriteName, setFavoriteName] = useState('');
  const [showSaveFavDialog, setShowSaveFavDialog] = useState(false);
  const [showPrepTicket, setShowPrepTicket] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);

  const getStewName = (id?: string) => {
    if (!id) return '';
    return STEW_OPTIONS.find(s => s.id === id)?.name || id.replace('_', ' ');
  };

  const getProteinName = (id: string) => {
    return PROTEIN_OPTIONS.find(p => p.id === id)?.name || id.replace('_', ' ');
  };

  const getSideName = (id: string) => {
    return SIDE_OPTIONS.find(s => s.id === id)?.name || id.replace('_', ' ');
  };

  const getToppingName = (id: string) => {
    return TOPPING_OPTIONS.find(t => t.id === id)?.name || id.replace('_', ' ');
  };

  const handleSaveFavoriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!favoriteName.trim()) return;
    onSaveFavorite(favoriteName.trim());
    setFavoriteName('');
    setShowSaveFavDialog(false);
  };

  const generatePrepTicketText = () => {
    let ticket = `===================================\n`;
    ticket += `       KITCHEN PREP TICKET        \n`;
    ticket += `       Date: ${new Date().toLocaleDateString()}      \n`;
    ticket += `===================================\n\n`;

    currentPlate.forEach((meal, idx) => {
      ticket += `${idx + 1}. ${meal.baseItem.emoji} ${meal.baseItem.name.toUpperCase()}\n`;
      if (meal.spaghettiStyle) {
        ticket += `   • Style: Spaghetti (${meal.spaghettiStyle === 'stewed' ? 'With Tomatoes Stew' : 'Fried with Veggies'})\n`;
      }
      if (meal.selectedStew) {
        ticket += `   • Sauce/Stew: ${getStewName(meal.selectedStew)}\n`;
      }
      if (meal.selectedBankuSide) {
        ticket += `   • Side Sauce: ${meal.selectedBankuSide === 'okro' ? 'Okro Stew' : meal.selectedBankuSide === 'tomato' ? 'Tomatoes Stew' : 'Pepper Sauce'}\n`;
      }
      if (meal.selectedProteins && meal.selectedProteins.length > 0) {
        ticket += `   • Protein Extras: ${meal.selectedProteins.map(getProteinName).join(', ')}\n`;
      }
      if (meal.selectedSides.length > 0) {
        const isSnack = meal.baseItem.customizationType === 'snack';
        ticket += `   • ${isSnack ? 'Chilled Drink Complement' : 'Complementary Side'}: ${meal.selectedSides.map(getSideName).join(', ')}\n`;
      }
      if (meal.selectedToppings && meal.selectedToppings.length > 0) {
        ticket += `   • Toppings & Sweets: ${meal.selectedToppings.map(getToppingName).join(', ')}\n`;
      }
      if (meal.notes) {
        ticket += `   • Notes: "${meal.notes}"\n`;
      }
      ticket += `\n`;
    });

    ticket += `===================================\n`;
    ticket += `Enjoy your personal meal creation! 🍳\n`;
    ticket += `===================================`;
    return ticket;
  };

  const handleCopyTicket = () => {
    const text = generatePrepTicketText();
    navigator.clipboard.writeText(text);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  return (
    <div id="plate-summary-sidebar" className="glass-panel rounded-[28px] p-6 shadow-2xl space-y-6 h-full flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍽️</span>
            <div>
              <h3 className="font-bold text-zinc-100 text-base font-brand tracking-wide">My Selected Plate</h3>
              <p className="text-[10px] text-zinc-200 font-bold uppercase tracking-wider font-mono">Current selections</p>
            </div>
          </div>
          {currentPlate.length > 0 && (
            <button
              id="clear-plate-btn"
              onClick={onClearPlate}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Plate</span>
            </button>
          )}
        </div>

        {/* Current Selections Scroll List */}
        <div className="mt-5 space-y-4 max-h-[360px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {currentPlate.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="py-14 text-center flex flex-col items-center justify-center"
              >
                <span className="text-5xl filter grayscale opacity-30 mb-4 animate-bounce">🥣</span>
                <p className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">Your plate is empty!</p>
                <p className="text-[11px] text-zinc-300 mt-1.5 max-w-[200px] leading-relaxed font-medium">
                  Choose a base meal from breakfast, lunch, or dinner categories to start customizing.
                </p>
              </motion.div>
            ) : (
              currentPlate.map((meal) => {
                const isSnack = meal.baseItem.customizationType === 'snack';
                const isJollof = meal.baseItem.id.includes('jollof');
                return (
                  <motion.div
                    key={meal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                    id={`plate-item-${meal.id}`}
                    className="bg-black/30 rounded-2xl p-4 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col gap-2 relative group"
                  >
                    {/* Actions row floating on hover */}
                    <div className="absolute top-3 right-3 flex gap-1 bg-zinc-800/90 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`edit-plate-item-${meal.id}`}
                      onClick={() => onEditMeal(meal)}
                      className="p-1 text-neutral-400 hover:text-emerald-500 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                      title="Edit Customization"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`remove-plate-item-${meal.id}`}
                      onClick={() => onRemoveMeal(meal.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Base Item Name */}
                  <div className="flex items-center gap-2 pr-14">
                    <span className="text-2xl">{meal.baseItem.emoji}</span>
                    <span className="font-bold text-zinc-100 text-sm font-brand tracking-wide">{meal.baseItem.name}</span>
                  </div>

                  {/* Custom Options Bullet List */}
                  <div className="space-y-1.5 pl-1.5 mt-1">
                    {meal.spaghettiStyle && (
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Style: <strong className="text-neutral-800 capitalize font-bold">{meal.spaghettiStyle}</strong></span>
                      </p>
                    )}
                    {meal.selectedStew && !isJollof && (
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Base Sauce: <strong className="text-neutral-800 font-bold">{getStewName(meal.selectedStew)}</strong></span>
                      </p>
                    )}
                    {isJollof && (
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Sauce: <strong className="text-neutral-800 font-bold">Infused Smoky Stew</strong></span>
                      </p>
                    )}
                    {meal.selectedBankuSide && (
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Sauce Side: <strong className="text-neutral-800 capitalize font-bold">{meal.selectedBankuSide.replace('-', ' ')}</strong></span>
                      </p>
                    )}
                    {meal.selectedProteins && meal.selectedProteins.length > 0 && (
                      <p className="text-[11px] text-neutral-500 flex items-start gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <span>
                          Proteins:{' '}
                          <span className="text-neutral-900 font-bold">
                            {meal.selectedProteins.map(getProteinName).join(', ')}
                          </span>
                        </span>
                      </p>
                    )}
                    {meal.selectedSides.length > 0 && (
                      <p className="text-[11px] text-neutral-500 flex items-start gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <span>
                          {isSnack ? 'Drinks' : 'Sides'}:{' '}
                          <span className="text-neutral-900 font-bold">
                            {meal.selectedSides.map(getSideName).join(', ')}
                          </span>
                        </span>
                      </p>
                    )}
                    {meal.selectedToppings && meal.selectedToppings.length > 0 && (
                      <p className="text-[11px] text-neutral-500 flex items-start gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <span>
                          Extras:{' '}
                          <span className="text-neutral-900 font-bold">
                            {meal.selectedToppings.map(getToppingName).join(', ')}
                          </span>
                        </span>
                      </p>
                    )}
                    {meal.notes && (
                      <p className="text-[10px] text-emerald-400 italic bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 mt-2 font-medium">
                        "{meal.notes}"
                      </p>
                    )}
                  </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Checkout / Prep & Save Actions */}
      <div className="pt-5 border-t border-white/10 space-y-4">
        {currentPlate.length > 0 && (
          <div className="space-y-3.5">
            {/* Save Plate to Favorites Form Toggle */}
            {!showSaveFavDialog ? (
              <button
                id="toggle-save-favorites-btn"
                onClick={() => setShowSaveFavDialog(true)}
                className="w-full py-2.5 border border-dashed border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                <Heart className="w-3.5 h-3.5 text-emerald-500" />
                <span>Save Plate Combination</span>
              </button>
            ) : (
              <form onSubmit={handleSaveFavoriteSubmit} className="bg-zinc-800 border border-emerald-500/20 p-3.5 rounded-2xl space-y-2.5">
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider font-mono">Name this combination</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="favorite-combo-name-input"
                    value={favoriteName}
                    onChange={(e) => setFavoriteName(e.target.value)}
                    placeholder="e.g. Saturday Night Yam & Pepper"
                    required
                    className="flex-1 text-xs p-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                  >
                    Save
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSaveFavDialog(false)}
                  className="text-[10px] text-zinc-300 hover:text-zinc-300 font-bold uppercase tracking-wider underline cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Confirm Plate / Open Kitchen Receipt */}
            <button
              id="confirm-meal-plate-btn"
              onClick={() => setShowPrepTicket(true)}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg  flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>Confirm & Print Ticket</span>
            </button>
          </div>
        )}

        {/* Favorite Combos List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
            <Star className="w-3.5 h-3.5 text-emerald-500" />
            <span>My Favorite Combos ({savedFavorites.length})</span>
          </h4>

          {savedFavorites.length === 0 ? (
            <p className="text-[10px] text-zinc-300 italic leading-relaxed font-medium">
              No favorites saved yet. Save a customized combination to bypass individual selection steps.
            </p>
          ) : (
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {savedFavorites.map((fav) => (
                <div
                  key={fav.id}
                  id={`favorite-combo-row-${fav.id}`}
                  className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/20 p-3 rounded-2xl flex items-center justify-between text-left transition-all"
                >
                  <button
                    onClick={() => onLoadFavorite(fav)}
                    className="flex-1 text-left cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                  >
                    <p className="text-xs font-bold text-zinc-100 line-clamp-1 font-brand tracking-wide">{fav.name}</p>
                    <p className="text-[9px] text-zinc-300 mt-0.5 font-medium">
                      {fav.meals.length} meal{fav.meals.length > 1 ? 's' : ''} • {fav.meals.map(m => m.baseItem.emoji).join(' ')}
                    </p>
                  </button>
                  <button
                    onClick={() => onDeleteFavorite(fav.id)}
                    className="p-1 text-zinc-300 hover:text-rose-400 transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
                    title="Delete Favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- KITCHEN TICKET OVERLAY DIALOG --- */}
      <AnimatePresence>
        {showPrepTicket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="kitchen-ticket-overlay" 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 rounded-[32px] p-6 shadow-2xl max-w-md w-full border border-white/10 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-zinc-100 text-lg flex items-center gap-2 font-brand tracking-wide">
                  <span>🎫 Kitchen Prep Receipt</span>
                </h3>
              <button
                onClick={() => setShowPrepTicket(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-300 hover:text-zinc-300 transition-colors cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Printed Ticket */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 font-mono text-xs text-zinc-800 shadow-inner whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[300px]">
              {generatePrepTicketText()}
            </div>

            {/* Actions for Ticket */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="copy-kitchen-ticket"
                onClick={handleCopyTicket}
                className="py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                {copiedTicket ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-emerald-500 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Ticket</span>
                  </>
                )}
              </button>
              <button
                id="close-kitchen-ticket"
                onClick={() => {
                  setShowPrepTicket(false);
                  onClearPlate();
                }}
                className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 shadow-md  transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                <span>Plate Prepared! 🍽️</span>
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
