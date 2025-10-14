import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { UIProvider } from "./providers";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = localFont({
  src: "./fonts/Geist-Regular.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const geistBold = localFont({
  src: "./fonts/Geist-Bold.woff2",
  variable: "--font-geist-bold"
})
const geistBlack = localFont({
  src: "./fonts/Geist-Black.woff2",
  variable: "--font-geist-black"
})

export const metadata: Metadata = {
  title: "Scheduler App",
  description: "Let the AI do the thinking to make strategic schedules!",
  openGraph: {
    url: "https://scheduler.jossysola.com",
    type: "website",
    title: "Scheduler",
    description: "Let the AI do the thinking to make strategic schedules!",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/25f031f4-8b86-4763-acb6-14e5afdd57a2.png?token=gJDkX97UMNp3Xk5siysdNuubSuuKyLKZ_rYL8AYrmoc&height=630&width=1200&expires=33279455004",
        width: 1200,
        height: 630,
        alt: "Scheduler preview image",
      },
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Scheduler",
    description: "Let the AI do the thinking to make strategic schedules!",
    images: ["https://opengraph.b-cdn.net/production/images/25f031f4-8b86-4763-acb6-14e5afdd57a2.png?token=gJDkX97UMNp3Xk5siysdNuubSuuKyLKZ_rYL8AYrmoc&height=630&width=1200&expires=33279455004"],
  },
  facebook: {
    appId: "1278252816710964"
  },
};
// Meta Tags Generated via https://www.opengraph.xyz
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistBold.variable} ${geistBlack.variable} antialiased`}>
        <main>
          <UIProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </UIProvider>
        </main>
      </body>
    </html>
  );
}
