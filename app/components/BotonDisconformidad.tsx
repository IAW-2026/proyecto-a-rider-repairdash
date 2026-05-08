"use client"
export default function BotonDisconformidad() {
    return (
        <div>
            <button className="w-full rounded-2xl p-6 flex flex-col gap-4 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md" onClick={() => window.location.reload()}>
                Disconformidad
            </button>
        </div>
    );
    //luego avisar disconformidad al driver
    //debe ir a feedback para poder elaborar un reporte
}