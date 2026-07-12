'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, RefreshCw, AlertCircle, Calendar } from 'lucide-react';

const SPORT_EMOJIS: Record<string, string> = {
  'Football': '⚽',
  'Ice Hockey': '🏒',
  'Tennis': '🎾',
  'Basketball': '🏀',
  'Baseball': '⚾',
  'Boxing': '🥊'
};

export default function Dashboard() {
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Global Bankroll Config
  const [globalBankroll, setGlobalBankroll] = useState<number>(10000);
  const [allocationPercent, setAllocationPercent] = useState<number>(10); // 10% of bankroll per bet

  useEffect(() => {
    const fetchDiscrepancies = () => {
      fetch('/api/discrepancies')
        .then(res => res.json())
        .then(data => {
          setDiscrepancies(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setDiscrepancies([]);
          setLoading(false);
        });
    };

    // ANTI-CHEAT: Disable right-click and copy
    const preventAction = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', preventAction);
    document.addEventListener('copy', preventAction);
    
    // Fetch loop
    fetchDiscrepancies();
    const interval = setInterval(fetchDiscrepancies, 10000);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('contextmenu', preventAction);
      document.removeEventListener('copy', preventAction);
    };
  }, []);

  const currentStakePerBet = (globalBankroll * allocationPercent) / 100;

  const calculateStakes = (details: any[], total: number) => {
    const impliedProb = details.reduce((acc, det) => acc + (1 / det.price), 0);
    return details.map(det => {
      const stake = (total / det.price) / impliedProb;
      const payout = stake * det.price;
      return { ...det, stake, payout };
    });
  };

  const formatSEK = (amount: number) => {
    return amount.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' });
  };

  const formatMarket = (market: string) => {
    if (market === 'OU_2.5') return 'Over/Under 2.5 Goals';
    if (market === '1X2') return 'Match Winner (1X2)';
    return market;
  };

  // Profit Simulator Calculations
  const simulatedProfits = useMemo(() => {
    let totalGuaranteedProfit = 0;
    
    discrepancies.forEach(arb => {
      const stakes = calculateStakes(arb.details, currentStakePerBet);
      // Payout is the same regardless of outcome in a perfect arb
      const payout = stakes[0].payout;
      const profit = payout - currentStakePerBet;
      totalGuaranteedProfit += profit;
    });

    return totalGuaranteedProfit;
  }, [discrepancies, currentStakePerBet]);

  // Chart Data for Bankroll Growth
  const chartData = useMemo(() => {
    const data = [{ name: 'Current', Bankroll: globalBankroll }];
    let projected = globalBankroll;
    
    discrepancies.forEach((arb, idx) => {
      const stakes = calculateStakes(arb.details, currentStakePerBet);
      const profit = stakes[0].payout - currentStakePerBet;
      projected += profit;
      data.push({ name: `Bet ${idx + 1}`, Bankroll: parseFloat(projected.toFixed(2)) });
    });
    
    return data;
  }, [discrepancies, globalBankroll, currentStakePerBet]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans p-4 md:p-8 select-none">
      <nav className="mb-8 md:mb-12 flex justify-between items-center border-b border-white/5 pb-4 md:pb-6">
        <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          Arb<span className="text-emerald-500">Hunter</span> Dashboard
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Bankroll & Simulator (Sticky) */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="text-emerald-500" />
              Bankroll Simulator
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Total Bankroll (SEK)</label>
                <input 
                  type="number" 
                  value={globalBankroll} 
                  onChange={(e) => setGlobalBankroll(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Stake Allocation Per Bet (%)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={allocationPercent}
                    onChange={(e) => setAllocationPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="font-mono bg-neutral-950 px-3 py-1 rounded border border-white/5">{allocationPercent}%</span>
                </div>
                <div className="text-xs text-neutral-500 mt-2">
                  Investing <strong className="text-white">{formatSEK(currentStakePerBet)}</strong> per surebet
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-neutral-400">Simulated Net Profit</span>
                  <span className="text-3xl font-bold text-emerald-400">+{formatSEK(simulatedProfits)}</span>
                </div>
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                  <TrendingUp size={14} /> If you placed all active surebets right now
                </div>
              </div>

              {/* Recharts Bankroll Graph */}
              {discrepancies.length > 0 && (
                <div className="h-48 mt-8 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(value) => `${(value/1000).toFixed(1)}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Line type="monotone" dataKey="Bankroll" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Discrepancies */}
        <div className="xl:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              Opportunities
              <span className="bg-emerald-500/20 text-emerald-500 text-xs md:text-sm py-1 px-3 rounded-full font-medium">
                {discrepancies.length} Active
              </span>
            </h1>
            <div className="text-neutral-500 text-xs md:text-sm flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin md:w-3.5 md:h-3.5" /> Auto-syncing
            </div>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-white/5 rounded-2xl"></div>
              <div className="h-32 bg-white/5 rounded-2xl"></div>
            </div>
          ) : discrepancies.length === 0 ? (
            <div className="text-neutral-500 italic flex flex-col items-center justify-center p-12 border border-white/5 rounded-2xl bg-neutral-900/20">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p>No active surebets found in the market.</p>
              <p className="text-sm mt-2 opacity-50">The engine is scanning continuously...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {discrepancies.map((arb, index) => {
                  const isExpanded = expandedId === arb.id;
                  const stakes = isExpanded ? calculateStakes(arb.details, currentStakePerBet) : null;
                  
                  const matchDate = arb.start_time ? new Date(arb.start_time).toLocaleString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                  }) : 'Time TBD';

                  return (
                    <motion.div 
                      key={arb.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="rounded-2xl border border-white/10 bg-neutral-900/50 overflow-hidden"
                    >
                      {/* Clickable Header Row */}
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : arb.id)}
                        className="p-4 md:p-6 hover:bg-neutral-800/80 transition-colors cursor-pointer flex flex-col lg:flex-row justify-between items-start lg:items-center group gap-4 lg:gap-0"
                      >
                        <div className="w-full lg:w-auto">
                          <div className="flex justify-between items-start w-full">
                            <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
                              <span>{SPORT_EMOJIS[arb.sport] || '🏆'}</span>
                              <span className="line-clamp-1">{arb.match_name}</span>
                            </h3>
                            <div className="lg:hidden flex items-center gap-2">
                              <span className="text-xl font-bold text-emerald-400">+{arb.profit_percentage}%</span>
                              <div className={`text-neutral-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-neutral-400 text-xs md:text-sm mb-2">
                            {arb.league && <span className="bg-white/10 px-2 py-0.5 rounded text-neutral-300 max-w-[150px] truncate">{arb.league}</span>}
                            <span className="flex items-center gap-1 shrink-0"><Calendar size={12}/> {matchDate}</span>
                          </div>
                          <p className="text-neutral-500 text-xs md:text-sm">
                            {arb.sport} • Market: <span className="text-white font-medium">{formatMarket(arb.market)}</span>
                          </p>
                        </div>
                        
                        <div className="flex w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 gap-2 md:gap-6 hide-scrollbar">
                          {arb.details.map((det: any, idx: number) => (
                            <div key={idx} className="flex-1 lg:flex-none text-center px-2 md:px-4 border-l border-white/5 first:border-0 min-w-[80px]">
                              <div className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 truncate">{det.selection} <br/><span className="opacity-70">{det.bookie}</span></div>
                              <div className="font-mono text-base md:text-lg font-bold text-white">{det.price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>

                        <div className="hidden lg:flex text-right pl-6 border-l border-white/10 items-center gap-6">
                          <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Profit Margin</div>
                            <div className="text-2xl font-bold text-emerald-400">+{arb.profit_percentage}%</div>
                          </div>
                          <div className={`text-neutral-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </div>
                        </div>
                      </div>

                      {/* Calculator Panel */}
                      <AnimatePresence>
                        {isExpanded && stakes && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-neutral-950 p-6 border-t border-white/5 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {stakes.map((stake: any, idx: number) => (
                                <div key={idx} className="bg-neutral-900 rounded-xl p-3 md:p-4 border border-white/5 relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-neutral-700"></div>
                                  <div className="flex justify-between items-start mb-3 md:mb-4">
                                    <div>
                                      <div className="text-xs md:text-sm text-neutral-400">Place bet on</div>
                                      <div className="font-bold text-emerald-400 text-sm md:text-base">{stake.bookie}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-[10px] md:text-xs text-neutral-500">Selection</div>
                                      <div className="font-bold text-xs md:text-sm">{stake.selection} @ {stake.price.toFixed(2)}</div>
                                    </div>
                                  </div>
                                  <div className="text-center pt-3 md:pt-4 border-t border-white/5">
                                    <div className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1">Stake Required</div>
                                    <div className="font-mono text-xl md:text-2xl font-bold text-white">{formatSEK(stake.stake)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 gap-2 sm:gap-0">
                              <div className="text-emerald-500 font-medium text-sm md:text-base">Guaranteed Payout regardless of outcome:</div>
                              <div className="text-left sm:text-right flex items-baseline gap-2">
                                <span className="font-mono text-xl md:text-2xl font-bold text-emerald-400">{formatSEK(stakes[0].payout)}</span>
                                <span className="text-emerald-500/50 text-xs md:text-sm font-medium">({formatSEK(currentStakePerBet)} total stake)</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
