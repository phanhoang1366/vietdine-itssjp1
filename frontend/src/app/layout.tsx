import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "VietDine - ベトダイン",
  description: "Authentic Vietnamese Dining in Hanoi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className={`${manrope.variable} min-h-screen font-body antialiased overflow-x-hidden`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <LanguageProvider>
            <AuthProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </AuthProvider>
          </LanguageProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

