import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { UIProvider } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const solitreo = localFont({
  src: "./fonts/Solitreo-Regular.ttf",
  variable: "--font-solitreo",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Scheduler App",
  description: "Plan schedules using Artificial Intelligence by setting up criteria and hitting a button!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} w-full antialiased`}>
        <UIProvider>
        {children}
        </UIProvider>
      </body>
    </html>
  );
}
