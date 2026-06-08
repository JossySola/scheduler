import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClientProviders } from "./provider";
import { headers } from "next/headers";
import { isRTL } from "react-aria-components";
import { getTranslations } from "next-intl/server";
import SignOut from "./(auth)/_components/sign-out-button";
import { createClient } from "@/lib/supabase/server";

const geistSans = localFont({
  src: "../../../fonts/Geist-Regular.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const geistBold = localFont({
  src: "../../../fonts/Geist-Bold.woff2",
  variable: "--font-geist-bold",
});
const geistBlack = localFont({
  src: "../../../fonts/Geist-Black.woff2",
  variable: "--font-geist-black",
});
const geistSemiBold = localFont({
  src: "../../../fonts/Geist-SemiBold.woff2",
  variable: "--font-geist-semibold",
})

export const metadata: Metadata = {
  title: "Scheduler App",
  description: "AI-powered strategic scheduling application that generates personalized schedules based on user specifications and values using Anthropic’s Claude AI",
  openGraph: {
    url: "https://scheduler.jossysola.com",
    type: "website",
    title: "Scheduler",
    description: "AI-powered strategic scheduling application that generates personalized schedules based on user specifications and values using Anthropic’s Claude AI",
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
    description: "AI-powered strategic scheduling application that generates personalized schedules based on user specifications and values using Anthropic’s Claude AI",
    images: ["https://opengraph.b-cdn.net/production/images/25f031f4-8b86-4763-acb6-14e5afdd57a2.png?token=gJDkX97UMNp3Xk5siysdNuubSuuKyLKZ_rYL8AYrmoc&height=630&width=1200&expires=33279455004"],
  },
  facebook: {
    appId: "1278252816710964"
  },
};
// Meta Tags Generated via https://www.opengraph.xyz
export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Internationalization
  const acceptLanguage = (await headers()).get('accept-language');
  const lang = acceptLanguage?.split(/[,;]/)[0] || 'en-US';
  const translation = await getTranslations("auth-form");
  // Session checkup
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  
  return (
    <html lang={ lang } dir={isRTL(lang) ? "rtl" : "ltr"}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistBold.variable} ${geistBlack.variable} ${geistSemiBold.variable} antialiased`}>
        <nav>{
          data && data.claims.email
          ? <SignOut />
          : null
        }</nav>
        <ClientProviders lang={ lang }>
          { children }
          <Analytics />
          <SpeedInsights />
        </ClientProviders>
      </body>
    </html>
  );
}