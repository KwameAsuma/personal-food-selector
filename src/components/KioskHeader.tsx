import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Sun, Sunrise, Sunset, Moon, Sparkles, History, LogOut, User, Settings, Palette } from 'lucide-react';
import { MealPeriod } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: <Sunrise className="w-5 h-5 text-emerald-600 dark:text-emerald-500" /> };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-500" /> };
    if (hour >= 17 && hour < 22) return { text: 'Good Evening', icon: <Sunset className="w-5 h-5 text-emerald-700 dark:text-emerald-600" /> };
    return { text: 'Late Night Cravings', icon: <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> };
  };

  const greeting = getGreeting();

  const periods: { id: MealPeriod; label: string; icon: string; hours: string; hoverColor: string }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: '🍳', hours: '5 AM - 11 AM', hoverColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-500' },
    { id: 'lunch', label: 'Lunch', icon: '🍚', hours: '11 AM - 4 PM', hoverColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-500' },
    { id: 'dinner', label: 'Dinner', icon: '🍲', hours: '4 PM - 10 PM', hoverColor: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-600' },
    { id: 'snacks', label: 'Snacks', icon: '🍕', hours: '10 PM - 5 AM', hoverColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-500' }
  ];

  const getDisplayName = () => {
    if (!sessionUser?.email) return 'User';
    // Remove @bitedecide.com to get the name
    return sessionUser.email.split('@')[0];
  };

  return (
    <header id="kiosk-header" className="bg-white/80 dark:bg-zinc-900/65 backdrop-blur-xl border-b border-black/5 dark:border-white/5 sticky top-0 z-30 shadow-xl dark:shadow-2xl transition-colors duration-300">
      <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 border-b border-black/5 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-200 gap-2 font-medium">
          <div className="flex items-center gap-2">
            {greeting.icon}
            <span className="text-zinc-900 dark:text-zinc-200 font-extrabold">{greeting.text}</span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-800 dark:text-zinc-300 bg-black/5 dark:bg-black/40 px-3 py-1 rounded-xl border border-black/5 dark:border-white/5 shadow-inner transition-colors duration-300">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="text-zinc-500 dark:text-zinc-300 text-[10px] uppercase tracking-wider hidden md:inline font-mono font-bold italic">
              Don't know what to eat? BiteDecide makes food choice easy.
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-8 justify-between">
          <div className="flex items-center gap-4">
            {/* Brand Logo */}
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl font-brand shadow-lg shrink-0 transform hover:rotate-6 transition-all duration-300 border border-emerald-400/30">
              <span>B</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide text-zinc-900 dark:text-white font-brand flex items-center gap-2 transition-colors duration-300">
                <span>BiteDecide</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-sm dark:shadow-lg transition-colors duration-300">
                  Menu
                </span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-200 mt-0.5 font-medium transition-colors duration-300">
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
              className="flex items-center gap-2 px-5 py-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md dark:shadow-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-black/5 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Surprise Me! 🎲</span>
              <span className="sm:hidden">🎲</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewHistory}
              className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md dark:shadow-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-black/5 dark:border-white/10"
            >
              <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">History</span>
            </motion.button>

            {/* Profile Dropdown Menu */}
            {sessionUser && onLogout && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md dark:shadow-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-emerald-500/30"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline capitalize">{getDisplayName()}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden z-50 flex flex-col"
                    >
                      <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate capitalize">{getDisplayName()}</p>
                      </div>
                      
                      <div className="p-2 flex flex-col gap-1">
                        <button
                          onClick={() => {
                            toggleTheme();
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors w-full text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                            <span>Theme</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                            {theme === 'dark' ? 'DARK' : 'LIGHT'}
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium transition-colors w-full text-left cursor-pointer group"
                        >
                          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                className={`flex-1 min-w-[145px] p-3.5 rounded-[18px] text-left transition-all relative group cursor-pointer hover:scale-[1.03] active:scale-[0.98] ${
                  isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-200 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white dark:bg-emerald-500 rounded-[18px] shadow-md dark:shadow-lg border border-black/5 dark:border-emerald-400/50 transition-colors duration-300"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-2xl filter group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{period.icon}</span>
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-emerald-500' : 'bg-white'} animate-ping absolute top-0 right-0`} />
                  )}
                </div>
                <div className="relative z-10 mt-2.5">
                  <p className={`font-bold text-sm uppercase tracking-wide font-brand transition-colors duration-300 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-300'}`}>
                    {period.label}
                  </p>
                  <p className={`text-[10px] mt-0.5 font-bold transition-colors duration-300 ${isActive ? 'text-emerald-600 dark:text-emerald-100' : 'text-zinc-400 dark:text-zinc-300 font-medium'}`}>
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
