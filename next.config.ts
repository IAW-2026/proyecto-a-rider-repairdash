import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
  },
  experimental: {
    serverActions: {
      // Sube el límite de body de los server actions de 1 MB (default) a 5 MB.
      // Complementa la compresión client-side (ver lib/utils/compressImage.ts):
      // varias fotos comprimidas pueden seguir totalizando más de 1 MB.
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
};

export default nextConfig;
