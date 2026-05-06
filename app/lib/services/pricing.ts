export const PRECIOS: Record<string, { monto: number }> = {
  limpieza: { monto: 5000 },
  reparacion: { monto: 15000 },
  mantenimiento: { monto: 8000 },
  otro: { monto: 3000 },
};

export function PrecioconDescuento(monto: number, descuento: number) {
  return monto - (monto * descuento / 100);
}
