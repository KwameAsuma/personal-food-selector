import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Sun, Sunrise, Sunset, Moon, Sparkles, History, LogOut, User } from 'lucide-react';
import { MealPeriod } from '../types';

interface KioskHeaderProps {
  activePeriod: MealPeriod;
  onPeriodChange: (period: MealPeriod) => void;
  onOpenRandomizer: () => void;
  cartItemCount: number;
  onViewPlate: () => void;
  onViewHistory?: () => void;
  sessionUser?: any;
  onLogout?: () => void;
}

export default function KioskHeader({
  activePeriod,
  onPeriodChange,
  onOpenRandomizer,
  cartItemCount,
  onViewPlate,
  onViewHistory,
  sessionUser,
  onLogout
}: KioskHeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: <Sunrise className="w-5 h-5 text-emerald-500" /> };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: <Sun className="w-5 h-5 text-emerald-500" /> };
    if (hour >= 17 && hour < 22) return { text: 'Good Evening', icon: <Sunset className="w-5 h-5 text-emerald-600" /> };
    return { text: 'Late Night Cravings', icon: <Moon className="w-5 h-5 text-indigo-400" /> };
  };

  const greeting = getGreeting();

  const periods: { id: MealPeriod; label: string; icon: string; hours: string; hoverColor: string }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: '🍳', hours: '5 AM - 11 AM', hoverColor: 'group-hover:text-emerald-500' },
    { id: 'lunch', label: 'Lunch', icon: '🍚', hours: '11 AM - 4 PM', hoverColor: 'group-hover:text-emerald-500' },
    { id: 'dinner', label: 'Dinner', icon: '🍲', hours: '4 PM - 10 PM', hoverColor: 'group-hover:text-emerald-600' },
    { id: 'snacks', label: 'Snacks', icon: '🍕', hours: '10 PM - 5 AM', hoverColor: 'group-hover:text-emerald-500' }
  ];

  return (
    <header id="kiosk-header" className="glass-panel border-b border-white/5 sticky top-0 z-30 shadow-2xl">
      <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 border-b border-white/5 text-xs text-zinc-200 gap-2 font-medium">
          <div className="flex items-center gap-2">
            {greeting.icon}
            <span className="text-zinc-200 font-extrabold">{greeting.text}</span>
            <span className="text-zinc-600">|</span>
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-300 bg-black/40 px-3 py-1 rounded-xl border border-white/5 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="text-zinc-300 text-[10px] uppercase tracking-wider hidden md:inline font-mono font-bold">
              BiteDecide Kitchen Engine
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex items-center gap-4">
            {/* Brand Logo */}
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl font-brand shadow-lg shrink-0 transform hover:rotate-6 transition-all duration-300 border border-emerald-400/30">
              <span>B</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide text-white font-brand flex items-center gap-2">
                <span>BiteDecide</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-lg">
                  Menu
                </span>
              </h1>
              <p className="text-xs text-zinc-200 mt-0.5 font-medium">
                Sleek food builder inspired by real-time kitchen recipes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewPlate}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer border border-emerald-400/50"
            >
              <span>View Plate ({cartItemCount})</span>
            </motion.button>
            <motion.button
              id="roll-the-dice-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenRandomizer}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Surprise Me! 🎲</span>
              <span className="sm:hidden">🎲</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewHistory}
              className="flex items-center gap-2 px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-white/10"
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">History</span>
            </motion.button>
            {sessionUser && onLogout && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Log Out</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Meal Periods Selector Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4.5 scrollbar-none scroll-smooth">
          {periods.map((period) => {
            const isActive = activePeriod === period.id;
            return (
              <button
                key={period.id}
                id={`period-tab-${period.id}`}
                onClick={() => onPeriodChange(period.id)}
                className={`flex-1 min-w-[145px] p-3.5 rounded-[18px] text-left transition-all relative group cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform ${
                  isActive ? 'text-white' : 'text-zinc-200 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-emerald-500 rounded-[18px] shadow-lg border border-emerald-400/50"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-2xl filter group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{period.icon}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute top-0 right-0" />
                  )}
                </div>
                <div className="relative z-10 mt-2.5">
                  <p className={`font-bold text-sm uppercase tracking-wide font-brand ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                    {period.label}
                  </p>
                  <p className={`text-[10px] mt-0.5 font-bold ${isActive ? 'text-emerald-100' : 'text-zinc-300 font-medium'}`}>
                    {period.hours}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
