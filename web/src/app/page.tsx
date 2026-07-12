'use client';

import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const monthlyPrice = 1199;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-white scroll-smooth">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          Arb<span className="text-emerald-500">Hunter</span>.se
        </div>
        <div className="flex gap-6 text-sm font-medium items-center">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          <a href="/sign-in" className="hover:text-emerald-400 transition-colors">Member Login</a>
          <a href="#pricing" className="px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-all font-semibold">
            Apply for Access
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-32 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 relative z-10 leading-tight">
          Beat the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Swedish Bookies
          </span>
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mb-12 relative z-10">
          Real-time odds monitoring across Svenska Spel, Unibet, Betsson, and more. 
          Discover profitable surebets and value bets automatically.
        </p>
        
        <div className="flex gap-4 relative z-10">
          <a href="#pricing" className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Apply for Access
          </a>
          <a href="/dashboard" className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center">
            View Live Dashboard
          </a>
        </div>
      </section>

      {/* Stats / Value Prop */}
      <section id="features" className="px-8 py-20 border-t border-white/5 relative bg-neutral-900/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
            <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
            <p className="text-neutral-400">Live monitoring of thousands of football matches.</p>
          </div>
          <div className="p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
            <h3 className="text-4xl font-bold text-emerald-400 mb-2">1X2 & O/U</h3>
            <p className="text-neutral-400">Deep coverage of the most liquid betting markets.</p>
          </div>
          <div className="p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
            <h3 className="text-4xl font-bold text-white mb-2">Instant</h3>
            <p className="text-neutral-400">Real-time alerts to your dashboard and phone.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tighter mb-6">Strictly limited to <span className="text-emerald-500">50 members.</span></h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
              To protect our members from bookmaker detection and ensure our surebets stay alive, we operate as an exclusive, invite-only syndicate.
            </p>

            {/* Break-Even Info Box */}
            <div className="max-w-xl mx-auto mb-16 bg-neutral-900/50 border border-white/5 rounded-2xl p-6 text-left">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                The Break-Even Math
              </h3>
              <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                If you generate an average of <strong>2% net profit per day</strong> (the industry standard), what is the minimum bankroll required to pay for this subscription?
              </p>
              <div className="bg-black/50 rounded-xl p-4 font-mono text-sm border border-white/5">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-500">Subscription Cost</span>
                  <span className="text-white">1199 SEK / month</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-500">Required Daily Profit</span>
                  <span className="text-white">~40 SEK / day</span>
                </div>
                <div className="border-t border-white/5 my-2 pt-2 flex justify-between font-bold">
                  <span className="text-emerald-500">Minimum Required Bankroll</span>
                  <span className="text-emerald-400">2,000 SEK</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4 text-center">
                If your total bankroll is larger than 2,000 SEK, everything above that is pure profit.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <motion.div 
              className="bg-neutral-900/80 border-2 border-emerald-500/50 rounded-3xl p-10 relative backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              whileHover={{ y: -5, boxShadow: "0 0 50px rgba(16,185,129,0.25)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
                All Access Pass
              </div>
              
              <div className="text-center border-b border-white/10 pb-8 mb-8 mt-4">
                <div className="text-neutral-400 font-medium mb-4 flex items-center justify-center gap-2">
                  <ShieldAlert size={16} className="text-emerald-500"/>
                  Currently Accepting Applications
                </div>
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tighter">{monthlyPrice}</span>
                  <span className="text-xl text-neutral-400 font-medium">SEK / mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  'Unlimited Real-Time Surebets',
                  'Uncapped Profit Margins',
                  'Live Dashboard Auto-Sync',
                  'Bankroll Profit Simulator',
                  'Pre-Game Time Filtering',
                  'Email & Telegram Alerts',
                  'Referral Discount (-199 SEK for 6 Months)'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-neutral-200">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-emerald-500 text-black font-bold text-lg py-4 rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Submit Application
              </button>
              <p className="text-xs text-neutral-500 text-center mt-4">
                Applicants will be reviewed within 24 hours.
              </p>
            </motion.div>
          </div>

        </div>
      </section>
      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black py-12 px-8 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 opacity-50">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            Arb<span className="text-emerald-500">Hunter</span>.se
          </div>
          
          <div className="flex gap-8 text-sm text-neutral-500">
            <a href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Use</a>
            <a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
