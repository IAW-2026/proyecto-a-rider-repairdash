import BotonLogIn from "./components/BotonLogIn";
import Lazy from "./components/lazyProvisioning";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[linear-gradient(135deg,var(--color-brand-bg)_0%,var(--color-brand-surface)_60%,var(--color-brand-bg)_100%)]">

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none bg-brand-accent" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none bg-brand-purple" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))]">
            🔧
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-brand-text">
            Repair<span className="text-brand-accent">Dash</span>
          </h1>
          <p className="text-base font-medium text-brand-muted">
            Tu plataforma de servicios técnicos
          </p>
        </div>
        <Lazy/>
        <BotonLogIn />
      </div>
    </main>
  );
}
