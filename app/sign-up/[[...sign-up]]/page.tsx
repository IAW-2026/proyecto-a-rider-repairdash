import { SignUp } from "@clerk/nextjs";

const clerkAppearance = {
  elements: {
    rootBox: "flex justify-center w-full",
    card: "bg-rd-surface border border-rd-border-2 backdrop-blur-xl rounded-2xl p-2 w-full max-w-full",
    headerTitle: "text-rd-text font-bold text-3xl tracking-tight",
    headerSubtitle: "text-rd-muted text-sm mt-2",
    socialButtonsBlockButton:
      "border-rd-border-2 hover:bg-rd-elevated hover:border-rd-border-3 text-rd-text transition-colors rounded-xl",
    socialButtonsBlockButtonText: "text-rd-text font-semibold",
    socialButtonsProviderIcon: "filter invert",
    dividerLine: "bg-rd-border-2",
    dividerText: "text-rd-muted",
    formFieldLabel: "text-rd-text-2 font-semibold text-xs tracking-wide",
    formFieldInput:
      "bg-rd-inset border border-rd-border-2 text-rd-text focus:border-rd-accent focus:bg-rd-bg rounded-xl px-3.5 py-3 transition-colors text-sm",
    formButtonPrimary:
      "bg-rd-accent hover:bg-[#C932BD] transition-colors text-white font-semibold rounded-xl py-3 mt-2",
    footerActionText: "text-rd-muted",
    footerActionLink:
      "text-rd-accent-soft hover:text-rd-accent transition-colors font-semibold",
    identityPreviewText: "text-rd-text",
    identityPreviewEditButton:
      "text-rd-accent-soft hover:text-rd-accent",
    formFieldAction:
      "text-rd-accent-soft hover:text-rd-accent transition-colors",
    formFieldSuccessText: "text-rd-ok",
    formFieldErrorText: "text-rd-danger",
  },
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      >
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-rd-accent/15 blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-rd-purple/15 blur-[120px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md mx-auto flex justify-center">
        <SignUp appearance={clerkAppearance} />
      </div>
    </div>
  );
}
