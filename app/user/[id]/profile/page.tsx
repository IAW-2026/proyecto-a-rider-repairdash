import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getClienteID } from "@/lib/actions/clientes";
import { getViajesByClienteId } from "@/lib/queries/viajes";
import TablaViajes from "@/app/components/TablaViajes";
import ProfileSkeleton from "@/app/components/skeletons/ProfileSkeleton";
import {
  PageHeader,
  Stars,
  Pill,
  Avatar,
  Button,
} from "@/app/components/ui";

const fmtMonto = (m?: unknown) => {
  if (m == null) return "—";
  const num = Number(typeof m === "number" || typeof m === "string" ? m : String(m));
  if (Number.isNaN(num)) return "—";
  return "$ " + num.toLocaleString("es-AR");
};

const fmtFecha = (f?: Date | string | null) => {
  if (!f) return "Sin fecha";
  const d = typeof f === "string" ? new Date(f) : f;
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

async function ProfileData({ id }: { id: string }) {
  const [cliente, viajes, user] = await Promise.all([
    getClienteID(id),
    getViajesByClienteId(Number(id)),
    currentUser(),
  ]);

  const nombre = cliente?.nombre ?? user?.firstName ?? "Usuario";
  const apellido = cliente?.apellido ?? user?.lastName ?? "";
  const fullName = `${nombre} ${apellido}`.trim();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const calificacion = Number(cliente?.calificacion ?? 0);
  const ultimos4 = viajes.slice(0, 4);

  return (
    <div className="py-2 sm:py-4 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Cliente · Perfil"
        title="Mi perfil"
        description="Información de tu cuenta y resumen de actividad."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 lg:gap-6">
        {/* Identity card */}
        <div className="rounded-2xl p-6 sm:p-7 bg-rd-surface border border-rd-border flex flex-col items-center text-center">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={`${fullName} avatar`}
              width={96}
              height={96}
              priority
              fetchPriority="high"
              className="rounded-full"
            />
          ) : (
            <Avatar name={fullName} size={96} />
          )}

          <h2 className="text-xl sm:text-2xl font-bold text-rd-text mt-4 tracking-tight">
            {fullName}
          </h2>
          {email && (
            <p className="text-sm text-rd-muted mt-1 break-all">{email}</p>
          )}

          {calificacion > 0 && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-rd-bg-2 border border-rd-border flex flex-col items-center gap-1.5">
              <Stars value={calificacion} size={16} />
              <div className="text-sm font-semibold tabular-rd text-rd-text">
                {calificacion.toFixed(1)}
                <span className="text-rd-muted font-normal"> / 5</span>
              </div>
            </div>
          )}

          <Button
            href="https://proyecto-a-payments-repairdash-lvnq2cmkm.vercel.app/driver"
            className="w-full mt-5"
          >
            <CreditCard size={16} strokeWidth={1.75} />
            Ver balance y pagos
          </Button>

          <div className="w-full mt-5 pt-4 border-t border-rd-border-2 text-xs text-rd-muted">
            <div className="flex justify-between py-1">
              <span>ID cliente</span>
              <span className="font-mono-rd text-rd-text-2">#{id}</span>
            </div>
            <div className="flex justify-between py-1 items-center">
              <span>Clerk</span>
              <span className="text-rd-ok inline-flex items-center gap-1.5">
                <CheckCircle2 size={12} strokeWidth={2} />
                Sincronizado
              </span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-rd-text">
                Últimos 4 viajes
              </h2>
              <Link
                href={`/user/${id}/travels`}
                className="text-xs text-rd-accent-soft font-semibold hover:underline"
              >
                Ver todos →
              </Link>
            </div>

            {ultimos4.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ultimos4.map((v) => (
                  <article
                    key={v.id_viaje}
                    className="rounded-xl p-4 bg-rd-bg-2 border border-rd-border"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Pill tone="mute" size="sm">
                        {v.estado ?? "—"}
                      </Pill>
                      <span className="font-mono-rd text-[10.5px] text-rd-muted">
                        #{v.id_viaje}
                      </span>
                    </div>
                    <div className="font-bold text-sm capitalize text-rd-text">
                      {v.tipo_de_trabajo}
                    </div>
                    <div className="text-[11.5px] text-rd-muted mt-1">
                      {(v.driver ?? "Sin trabajador")} · {fmtFecha(v.fecha)}
                    </div>
                    <div className="mt-2 font-bold text-sm tabular-rd text-rd-text">
                      {fmtMonto(v.pagos?.[0]?.monto)}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-6 text-center bg-rd-bg-2 border border-rd-border text-sm text-rd-muted">
                Aún no hay viajes recientes.
              </div>
            )}
          </section>

        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-bold text-rd-text mb-3">
          Historial completo
        </h2>
        <TablaViajes filas={viajes} />
      </section>
    </div>
  );
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData id={id} />
    </Suspense>
  );
}
