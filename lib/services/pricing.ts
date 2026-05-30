export function PrecioconDescuento(monto: number, descuento: number) {
  return monto - (monto * descuento / 100);
}
