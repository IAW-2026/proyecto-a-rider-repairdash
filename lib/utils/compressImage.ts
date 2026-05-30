/**
 * Redimensiona y recomprime una imagen del lado cliente para evitar pegarle
 * al límite de body de los server actions (1 MB default, 4.5 MB en Vercel).
 *
 * Fotos de cámara mobile (12MP+) o de IA en alta definición suelen pesar 3-8 MB.
 * Tras esta función pasan a ~300-800 KB sin pérdida perceptible.
 */
export async function compressImage(
  file: File,
  maxDim = 1920,
  quality = 0.85,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    i.src = dataUrl;
  });

  const { width, height } = img;
  const max = Math.max(width, height);

  // Si ya pesa poco y no es enorme, devolver tal cual
  if (max <= maxDim && file.size < 800_000) return file;

  const scale = max > maxDim ? maxDim / max : 1;
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
