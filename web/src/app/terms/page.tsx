import React from 'react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-white pb-20">
      <nav className="w-full px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-neutral-950/80">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            Arb<span className="text-emerald-500">Hunter</span>.se
          </a>
          <a href="/" className="text-sm text-neutral-400 hover:text-white">Back to Home</a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-8 pt-16">
        <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
        <p className="text-neutral-400 mb-12 border-b border-white/10 pb-8">Last Updated: July 2026</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By applying for access and using the ArbHunter.se platform ("the Service"), you agree to be bound by these Terms of Use. Because our platform is operated as an exclusive syndicate strictly limited to 50 members, any violation of these terms will result in immediate termination of your account without a refund.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">2. The Referral Program & Syndicate Rules</h2>
            <p className="mb-2">
              We offer a Referral Program where existing members can invite new users to apply. If an invited member is accepted, both the referrer and the referee receive a discounted rate of 1000 SEK/month for 6 months. 
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 mt-4">
              <strong className="text-red-400">CRITICAL: The "Mutually Assured Destruction" Clause</strong>
              <p className="mt-2 text-sm">
                If the invited member breaks any of our terms (e.g., leaking surebets, scraping the platform, or violating anti-cheat systems), <strong>BOTH the invited member and the original member who referred them will be permanently banned.</strong> You are responsible for the trustworthiness of the people you invite into the syndicate.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">3. Anti-Cheat and Leak Protection</h2>
            <p>
              The Service provides proprietary arbitrage opportunities. You are strictly prohibited from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-neutral-400">
              <li>Sharing, screenshotting, or publicly posting any surebets found on the dashboard.</li>
              <li>Using automated scraping tools, bots, or scripts to extract data from the dashboard.</li>
              <li>Selling or reselling the information provided by the Service.</li>
            </ul>
            <p className="mt-4">
              We employ automated anti-copy and tracking scripts. If our systems detect anomalous behavior or copying, your account will be suspended pending investigation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">4. No Financial Advice or Guarantees</h2>
            <p>
              The Service provides mathematical data regarding odds discrepancies across third-party bookmakers. We are not a financial advisor, nor do we provide gambling advice. While the mathematics of arbitrage guarantee a profit <em>if executed perfectly</em>, we are not responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-neutral-400">
              <li>Bookmakers cancelling ("voiding") bets due to palpable errors.</li>
              <li>Your accounts being limited, restricted, or banned by third-party bookmakers.</li>
              <li>Odds changing before you can place both sides of the bet.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">5. Subscription & Refunds</h2>
            <p>
              Due to the exclusive nature of the syndicate and the immediate value of the data provided, <strong>all subscription payments are final and non-refundable</strong>. You may cancel your monthly renewal at any time, but no partial refunds will be given for the remainder of the month.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
