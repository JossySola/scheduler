import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
      <Script src="https://www.google.com/recaptcha/api.js?render=6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t" />
    </html>
  );
}
