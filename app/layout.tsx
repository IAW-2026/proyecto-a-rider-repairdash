import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import type { Viewport, Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import BfcacheWatch from "./_components/BfcacheWatch";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "RepairDash",
  description: "Plataforma de gestión de trabajos para riders de RepairDash",
};

const BUILD_ID = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "dev";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${jakarta.variable} ${jetbrains.variable} ${jakarta.className}`}
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `try { if (localStorage.getItem('__build_id') !== '${BUILD_ID}') { localStorage.clear(); localStorage.setItem('__build_id', '${BUILD_ID}'); } } catch(e) {}`,
            }}
          />
        </head>
        <body>
          <BfcacheWatch />
          <Toaster
            position="top-center"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--color-rd-surface)",
                border: "1px solid var(--color-rd-border-2)",
                color: "var(--color-rd-text)",
              },
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
