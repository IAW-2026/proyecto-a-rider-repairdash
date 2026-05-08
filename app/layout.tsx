import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Viewport, Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'RepairDash',
  description: 'Plataforma de gestión de trabajos para riders de RepairDash',
}

export default function RootLayout({children}:{
    children: React.ReactNode
}){
    return(
        <ClerkProvider>
        <html lang="es" className={jakarta.className} suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
        </ClerkProvider>
    )
}