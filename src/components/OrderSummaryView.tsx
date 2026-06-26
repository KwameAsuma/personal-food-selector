import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Receipt, Plus, Trash2 } from 'lucide-react';
import { CustomizedMeal } from '../types';
import { STEW_OPTIONS, PROTEIN_OPTIONS, SIDE_OPTIONS, TOPPING_OPTIONS } from '../data';

interface OrderSummaryViewProps {
  cartItems: CustomizedMeal[];
  onBackToMenu: () => void;
  onRemoveItem: (id: string) => void;
  onFinishOrder: () => void;
}

export default function OrderSummaryView({ cartItems, onBackToMenu, onRemoveItem, onFinishOrder }: OrderSummaryViewProps) {
  const resolveStew = (id?: string) => STEW_OPTIONS.find(s => s.id === id);
  const resolveProtein = (id: string) => PROTEIN_OPTIONS.find(p => p.id === id);
  const resolveSide = (id: string) => SIDE_OPTIONS.find(s => s.id === id);
  const resolveTopping = (id: string) => TOPPING_OPTIONS.find(t => t.id === id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-white font-brand tracking-wide flex items-center gap-3">
            <Receipt className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Your Order
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Please review your selections before confirming.</p>
        </div>
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-700 border border-black/10 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Add More Food
        </button>
      </div>

      <div className="space-y-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-[32px] border border-black/5 dark:border-white/5">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Your tray is empty.</p>
          </div>
        ) : (
          cartItems.map((item, index) => {
            const stew = resolveStew(item.selectedStew);
            const proteins = item.selectedProteins.map(resolveProtein).filter(Boolean);
            const sides = item.selectedSides.map(resolveSide).filter(Boolean);
            const toppings = (item.selectedToppings || []).map(resolveTopping).filter(Boolean);

            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative transition-colors duration-300"
              >
                {/* Left Side: Big Visual */}
                <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-zinc-50 dark:bg-zinc-800 border-r border-black/5 dark:border-white/5 flex items-center justify-center p-8">
                  {item.baseItem.imageUrl ? (
                    <img 
                      src={item.baseItem.imageUrl} 
                      alt={item.baseItem.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="text-8xl drop-shadow-2xl mb-4">{item.baseItem.emoji}</div>
                    <div className="bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px] shadow-lg backdrop-blur-sm">
                      Item {index + 1}
                    </div>
                  </div>
                </div>

                {/* Right Side: Order Details */}
                <div className="flex-1 p-8 flex flex-col justify-center relative">
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="mb-6 pb-6 border-b border-black/5 dark:border-white/5 pr-12">
                    <h3 className="text-3xl font-black text-white font-brand mb-2">
                      {item.baseItem.name}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-lg">
                      {item.baseItem.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {/* Stew / Style */}
                    {stew && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Stew & Sauce</span>
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                          <span className="text-lg">{stew.emoji}</span>
                          <span className="font-medium text-sm">{stew.name}</span>
                        </div>
                      </div>
                    )}
                    
                    {item.selectedBankuSide && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Banku Pair</span>
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                          <span className="font-medium text-sm capitalize">{item.selectedBankuSide}</span>
                        </div>
                      </div>
                    )}

                    {item.spaghettiStyle && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Preparation</span>
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                          <span className="font-medium text-sm capitalize">{item.spaghettiStyle} Style</span>
                        </div>
                      </div>
                    )}

                    {/* Proteins */}
                    {proteins.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Proteins</span>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {proteins.map((p, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
                              <span className="text-lg">{p?.emoji}</span>
                              <span className="font-medium text-sm">{p?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sides */}
                    {sides.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Sides & Extras</span>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {sides.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
                              <span className="text-lg">{s?.emoji}</span>
                              <span className="font-medium text-sm">{s?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Toppings */}
                    {toppings.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Toppings</span>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {toppings.map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
                              <span className="text-lg">{t?.emoji}</span>
                              <span className="font-medium text-sm">{t?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono block mb-2">Special Instructions</span>
                      <p className="text-sm text-amber-200/80 italic bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">"{item.notes}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-12 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFinishOrder}
            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 cursor-pointer"
          >
            <CheckCircle className="w-6 h-6" />
            Finish Order
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
