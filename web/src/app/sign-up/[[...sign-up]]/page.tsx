import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="text-3xl font-bold tracking-tighter mb-8 text-center flex justify-center items-center gap-2 text-white">
          <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          Arb<span className="text-emerald-500">Hunter</span>
        </div>

        <SignUp routing="hash" />
      </div>
    </main>
  )
}
