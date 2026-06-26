import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { History, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CustomizedMeal } from '../types';
import { STEW_OPTIONS, PROTEIN_OPTIONS, SIDE_OPTIONS, TOPPING_OPTIONS } from '../data';

interface HistoryViewProps {
  onBackToMenu: () => void;
}

export default function HistoryView({ onBackToMenu }: HistoryViewProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error: fetchError } = await supabase
        .from('saved_plates')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setHistory(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load history.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('saved_plates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setHistory(history.filter(h => h.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete plate: " + err.message);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white font-brand tracking-wide flex items-center gap-3">
            <History className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Order History
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Your previously saved plates from the cloud.</p>
        </div>
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-700 border border-black/10 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Back to Menu
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-500/10 rounded-[32px] border border-red-500/20 text-red-400">
          <p className="text-lg">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-[32px] border border-black/5 dark:border-white/5">
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">You haven't saved any plates yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((record) => (
            <div key={record.id} className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300">
              <button 
                onClick={() => handleDelete(record.id)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                title="Delete from history"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-brand">{record.name}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">{formatDate(record.created_at)}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {record.meals.map((meal: CustomizedMeal, i: number) => (
                  <div key={i} className="bg-zinc-50/50 dark:bg-zinc-800/50 rounded-xl p-3 border border-black/5 dark:border-white/5 flex items-center gap-3">
                    <div className="text-3xl">{meal.baseItem.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">{meal.baseItem.name}</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {[
                          meal.selectedStew ? STEW_OPTIONS.find(s => s.id === meal.selectedStew)?.name : null,
                          ...meal.selectedProteins.map(p => PROTEIN_OPTIONS.find(x => x.id === p)?.name),
                          ...meal.selectedSides.map(s => SIDE_OPTIONS.find(x => x.id === s)?.name)
                        ].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
