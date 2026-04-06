import { headers } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const acceptLanguage = (await headers()).get('accept-language');
  const accept = acceptLanguage?.split(/[,;]/)[0];
  const lang = accept === "en" || accept === "es" ? accept : "en";
  return (
    <html lang={lang} dir="ltr">
      <head>
        <link href="styles.css" rel="stylesheet" media="screen and (width > 600px)" />
        <link href="mobile.css" rel="stylesheet" media="screen and (width <= 600px)" />
        <link href="favicon.ico" rel="icon" />
        <link rel="preload" href="Geist-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="Geist-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="scheduler_logo" href="scheduler-black-105x16.png" sizes="105x16" type="image/png" />
        <link rel="scheduler_logo" href="scheduler-black-210x32.png" sizes="210x32" type="image/png" />
        <link rel="scheduler_logo" href="scheduler-black-420x64.png" sizes="420x64" type="image/png" />
        <link rel="scheduler_logo" href="scheduler-black-840x128.png" sizes="840x128" type="image/png" />
        <link rel="scheduler_icon" href="scheduler-icon-16.png" sizes="16x16" type="image/png" />
        <link rel="scheduler_icon" href="scheduler-icon-32.png" sizes="32x32" type="image/png" />
        <link rel="scheduler_icon" href="scheduler-icon-64.png" sizes="64x64" type="image/png" />
        <link rel="scheduler_icon" href="scheduler-icon-128.png" sizes="128x128" type="image/png" />
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
        <nav>
          <figure>
            <img src="scheduler-black-210x32.png" width="210" height="32" alt="Scheduler logo"/>
          </figure>
          <div aria-hidden="true" style={{ width: "fit-content" }}>
            <a className="action-button" href={`${process.env.NEXTAUTH_URL}/signin`}>{ lang === "es" ? "Iniciar sesión" : "Sign In" }</a>
            <a className="primary-button" href={`${process.env.NEXTAUTH_URL}/signup`}>{ lang === "es" ? "Registrarse" : "Sign Up" }</a>
          </div>
        </nav>
        <div style={{height: "4rem"}} aria-hidden="true"></div>
        { children }
      </body>
    </html>
  )
}