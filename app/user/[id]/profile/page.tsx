export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="py-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-brand-text">
        Mi Perfil
      </h1>

      {/* Profile card */}
      <div
        className="rounded-2xl p-8 flex flex-col items-center gap-4 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md"
      >
        <div
          className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-brand-accent shadow-[0_0_20px_#F500F160]"
        >
          <img
            src="/content/user-profile-icon.jpg"
            alt="Usuario"
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-1 text-brand-purple">
            ID de usuario
          </p>
          <p className="text-xl font-bold text-brand-text">{id}</p>
        </div>

        <div
          className="w-full rounded-xl px-4 py-3 text-center mt-2 bg-brand-accent/10 border border-brand-accent/30"
        >
          <p className="text-sm text-brand-lavender">
            Más información de perfil próximamente.
          </p>
        </div>
      </div>
    </div>
  );
}