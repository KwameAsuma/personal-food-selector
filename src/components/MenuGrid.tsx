import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Settings, Sparkles, Star } from 'lucide-react';
import { FoodOption } from '../types';

interface MenuGridProps {
  items: FoodOption[];
  onSelectMeal: (meal: FoodOption) => void;
}

export default function MenuGrid({ items, onSelectMeal }: MenuGridProps) {
  // Simple helper to assign food tags based on food types with elegant colors matching Bolt Food theme
  const getFoodTag = (id: string) => {
    if (id.includes('jollof') || id.includes('kenkey')) return { text: 'Traditional Fave', color: 'bg-emerald-50 text-emerald-700 font-bold' };
    if (id.includes('spaghetti') || id.includes('pizza')) return { text: 'Quick Comfort', color: 'bg-indigo-50 text-indigo-700 font-bold' };
    if (id.includes('sausages') || id.includes('fries') || id.includes('shawarma')) return { text: 'Sizzling Special', color: 'bg-rose-50 text-rose-700 font-bold' };
    if (id.includes('milo') || id.includes('tom_brown')) return { text: 'Warm Start', color: 'bg-amber-50 text-amber-800 font-bold' };
    if (id.includes('banku')) return { text: 'Staple Delight', color: 'bg-emerald-50 text-emerald-700 font-bold' };
    return { text: 'Premium Choice', color: 'bg-neutral-50 text-neutral-700 font-bold' };
  };

  return (
    <div id="menu-grid-container" className="py-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wide text-zinc-900 dark:text-zinc-100 font-brand flex items-center gap-2 transition-colors duration-300">
          <span>Popular Dishes</span>
          <span className="text-[11px] bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold font-sans px-2.5 py-0.5 rounded-full uppercase transition-colors duration-300">
            {items.length} choices
          </span>
        </h2>
        <div className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase tracking-wider hidden sm:block font-sans transition-colors duration-300">
          Tap card to customize stews & proteins
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {items.map((item) => {
          const tag = getFoodTag(item.id);
          return (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id={`food-card-${item.id}`}
              onClick={() => onSelectMeal(item)}
              className="glass-card hover:border-emerald-500/50 hover:shadow-lg rounded-[24px] transition-all duration-300 p-4 flex flex-col justify-between group cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform relative overflow-hidden"
            >
              <div>
                {/* Image Aspect ratio container */}
                <div className="w-full aspect-[4/3] bg-black/5 dark:bg-zinc-800/50 rounded-2xl mb-4.5 overflow-hidden relative shadow-sm border border-black/5 dark:border-white/5 transition-colors duration-300">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {item.emoji}
                    </div>
                  )}
                  {/* Small circular floating emoji badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm flex items-center justify-center text-base font-bold select-none border border-black/5 dark:border-white/10 z-10 text-zinc-900 dark:text-white transition-colors duration-300">
                    {item.emoji}
                  </div>
                </div>

                {/* Header with name and tag */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-wide font-brand">
                    {item.name}
                  </h3>
                </div>

                <p className="text-zinc-600 dark:text-zinc-200 text-[11px] mt-1.5 leading-relaxed font-medium transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Action Button Strip */}
              <div className="mt-5 pt-3.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono transition-colors duration-300">
                  {((item.name.length % 5) * 0.1 + 4.5).toFixed(1)} <Star className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400 transition-colors duration-300" />
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400/80 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono transition-colors">
                  <Settings className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:rotate-90 transition-all duration-500 ease-out" />
                  <span>Customize</span>
                </span>
                <span className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500 text-zinc-600 dark:text-zinc-200 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 border border-black/5 dark:border-white/5 group-hover:border-emerald-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
