import { headers } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const acceptLanguage = (await headers()).get('accept-language');
  const accept = acceptLanguage?.split(/[,;]/)[0];
  const lang = accept === "en" || accept === "es" ? accept : "en";
  return (
    <html lang={lang} dir="ltr">
      <head>
        <link href="styles.css" rel="stylesheet" />
        <link href="favicon.ico" rel="icon" />
        <link rel="preload" href="Geist-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="Geist-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content="AI-powered strategic scheduling application that generates personalized schedules based on user specifications and values using Anthropic’s Claude AI" />
        <meta property="og:title" content="Scheduler" />
        <meta property="og:site_name" content="Scheduler" />
        <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/25f031f4-8b86-4763-acb6-14e5afdd57a2.png?token=gJDkX97UMNp3Xk5siysdNuubSuuKyLKZ_rYL8AYrmoc&height=630&width=1200&expires=33279455004" />
        <meta property="og:description" content="AI-powered strategic scheduling application that generates personalized schedules based on user specifications and values using Anthropic’s Claude AI" />
        <title>Scheduler</title>
      </head>
      <body>
        { children }
      </body>
    </html>
  )
}