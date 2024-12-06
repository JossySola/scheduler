# KEY TAKEAWAYS

## **ReCAPTCHA in Next.js (App Router) + React**

1. Sign up for an API key pair and in this specific case, choose the client-side integration `reCAPTCHA v3`. *[Google reCAPTCHA intro](https://developers.google.com/recaptcha/intro)*
2. **Load the JavaScript API with sitekey at root `Layout`**
```javascript
import Script from "next/script";

//...

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
      <Script src="https://www.google.com/recaptcha/api.js?render=<reCAPTCHA_site_key>" />
    </html>
  );
}
```

3. **Create React custom hook to:**
  - Check availability of the Window object and return boolean State
  - Implement a handler function to use `grecaptcha.execute` and get the token
  - Verify form data input
  - Make a POST request to custom API endpoint
  - Provide a state `isSubmitting`

4. **At UI component**
  - Using the React custom hook:
    - Conditionally render component based on Window Object's availability state
    - On `<form>` use attribute `onSubmit` with the handler function provided by the React custom hook

## **Connect local PostgreSQL database for testing in Next.js (App Router) + React**
✔️
❌