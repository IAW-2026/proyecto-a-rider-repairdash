"use client"
export default function BotonConformidad() {
    return (
        <div>
            <button className="w-full rounded-2xl p-6 flex flex-col gap-4 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md" onClick={() => window.location.reload()}>
                Acepto
            </button>
        </div>
    );
    //luego avisar conformidad al driver
}