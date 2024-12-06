#KEY TAKEAWAYS

## **ReCAPTCHA**

1. Load the JavaScript API with your sitekey
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
      <Script src="https://www.google.com/recaptcha/api.js?render=reCAPTCHA_site_key" />
    </html>
  );
}
```

2. Create React custom hook to:
  - Check availability of the Window object
  - Implement a handler function to use `grecaptcha.execute` and get the token
  - Verify form data input
  - Make a POST request to custom API endpoint
  - Provide a state `isSubmitting`

3. At UI component
  - Utilize React custom hook
  - Conditionally render component based on Window Object's availability
  - On <form> use attribute `onSubmit` with the handler function provided by the React custom hook


✔️
❌