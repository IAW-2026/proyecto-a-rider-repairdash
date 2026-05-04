import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
export default function RootLayout({children}:{
    children: React.ReactNode
}){
    return(
        <ClerkProvider>
        <html>
            <head>
                <title>RepairDash</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}

            </body>
            
        </html>
        </ClerkProvider>
    )
}