import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idynic - Identity & Solution Platform",
  description: "Strategic Identity & Solution Platform powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
