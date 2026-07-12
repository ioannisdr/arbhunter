import React from 'react';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-neutral-400 mb-12 border-b border-white/10 pb-8">Last Updated: July 2026</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              When you apply for access to ArbHunter.se, we collect basic personal information to verify your identity and betting background. This includes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-neutral-400">
              <li>Name and Email Address.</li>
              <li>Responses to our intake form regarding your betting experience and bankroll.</li>
              <li>Payment and billing information (processed securely via our third-party payment provider, Stripe).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use your information exclusively to operate the syndicate and provide you with our services. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-neutral-400">
              <li>Review your application for the exclusive 50-member syndicate.</li>
              <li>Process your monthly subscription payments.</li>
              <li>Send you critical alerts, such as high-margin surebets via email or Telegram.</li>
              <li>Enforce our Anti-Cheat and Referral Program rules.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security & Anti-Cheat Monitoring</h2>
            <p>
              We take the security of our platform seriously. To enforce our strict no-leaking policy, we may collect technical data such as your IP address, browser type, and interaction data within the dashboard (e.g., monitoring copy/paste actions or suspicious high-frequency traffic). This data is used solely to protect the integrity of the syndicate.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing of Information</h2>
            <p>
              We <strong>never</strong> sell, rent, or trade your personal information to third parties or marketing agencies. We only share data with essential service providers (such as Stripe for payments or Telegram for notifications) necessary to run the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights (GDPR)</h2>
            <p>
              If you are a resident of the European Economic Area (EEA), you have the right to access, correct, or delete your personal data. If your account is terminated due to a violation of our Terms of Use, we may retain your email address and IP address on a permanent blacklist to prevent re-registration.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
