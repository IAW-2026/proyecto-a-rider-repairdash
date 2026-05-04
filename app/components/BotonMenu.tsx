"use client"
import { useRouter } from "next/navigation";

export default function BotonMenu({ id, pathname }: { id: string; pathname: string }) {
  const router = useRouter();
  const isActive = pathname === `/user/${id}/menu`;

  return (
    <button
      onClick={() => router.push(`/user/${id}/menu`)}
      className={`w-full text-left px-5 py-3.5 rounded-xl font-semibold text-base flex items-center gap-3 transition-all duration-200 border-l-[3px] ${
        isActive 
          ? "bg-[linear-gradient(135deg,#F500F120,#8D62A520)] text-brand-text border-brand-accent" 
          : "text-brand-muted border-transparent hover:text-brand-text"
      }`}
    >
      <span className={isActive ? "text-brand-accent" : "text-brand-purple"}>🏠</span>
      Menú
      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent" />}
    </button>
  );
}