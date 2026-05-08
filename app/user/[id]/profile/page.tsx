import { Show, UserButton } from "@clerk/nextjs";
import { getClienteID } from "@/app/lib/actions/clientes";
import { Suspense } from "react";
import ProfileSkeleton from "@/app/components/skeletons/ProfileSkeleton";

async function ProfileData({ id }: { id: string }) {
  const cliente = await getClienteID(id);
  const nombre = cliente?.nombre;
  const apellido = cliente?.apellido;
  
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
          <Show when="signed-in">
              <div className="w-24 h-24 rounded-full border-[3px] border-brand-accent shadow-[0_0_20px_#F500F170] flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
                <div className="scale-[3] origin-center flex items-center justify-center w-full h-full">
                  <UserButton />
                </div>
              </div>
          </Show>
        
        <div className="text-center">
          <p className="text-xl font-bold text-brand-text">{nombre} {apellido}</p>
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

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData id={id} />
    </Suspense>
  );
}