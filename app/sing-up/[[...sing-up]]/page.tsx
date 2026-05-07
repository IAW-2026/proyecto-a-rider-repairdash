import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full" />
      </div>
      
      <div className="z-10 w-full max-w-md mx-auto flex justify-center animate-fade-in-up">
        <SignUp 
           appearance={{
             elements: {
               rootBox: "flex justify-center w-full",
               card: "bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-xl shadow-2xl rounded-3xl p-2 w-full max-w-full",
               headerTitle: "text-brand-text font-extrabold text-3xl",
               headerSubtitle: "text-brand-lavender text-base mt-2",
               socialButtonsBlockButton: "border-brand-purple/40 hover:bg-brand-purple/20 hover:border-brand-purple text-brand-text transition-all duration-300 rounded-xl",
               socialButtonsBlockButtonText: "text-brand-text font-semibold",
               socialButtonsProviderIcon: "filter invert",
               dividerLine: "bg-brand-purple/30",
               dividerText: "text-brand-lavender font-medium",
               formFieldLabel: "text-brand-lavender font-semibold text-sm",
               formFieldInput: "bg-brand-bg/80 border border-brand-purple text-brand-text focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-3.5 transition-colors",
               formButtonPrimary: "bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-[0_0_16px_#F500F150] text-brand-text font-bold rounded-xl py-3.5 mt-2",
               footerActionText: "text-brand-lavender",
               footerActionLink: "text-brand-accent hover:text-brand-purple transition-colors font-bold",
               identityPreviewText: "text-brand-text",
               identityPreviewEditButton: "text-brand-accent hover:text-brand-purple",
               formFieldAction: "text-brand-accent hover:text-brand-purple transition-colors",
               formFieldSuccessText: "text-green-400",
               formFieldErrorText: "text-red-400"
             }
           }}
        />
      </div>
    </div>
  )
}