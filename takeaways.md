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

1. **Download PostgreSQL** *[Download here](https://www.postgresql.org/download/)*
  - Create a database and a table either through the PSQL or the Query tool interface (*pgAdmin*)
  - Through *pgAdmin*:
    - Object -> Create -> Server Group... -> *Set name*
    - On server created, right clic: Register -> Server... -> Connection
      - Set `Host name`, `Port`, `Maintanance database`, `Username`, `Password`
2. Create `.env.local` file
  - Set environment variables, e.g.:
    ```
    DB_USER="postgres"
    DB_HOST="localhost"
    DB_NAME="project"
    DB_PASSWORD=<password>
    DB_PORT="5432"
    ```
3. **Install node-postgres**
  ```
  $ npm install pg
  ```
4. **Create a file `db.ts` and connect to the local database**
```javascript
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default pool;
```

### Make a request to the local database using a custom API endpoint

#### Inside the `app` folder
1. Create an `Action Handler` inside the working route segment
  - await fetch(*< URLendpoint >*, { *< any payload >* })
2. Create custom endpoint
  - *app/api/< route >/route.ts*
3. Create function for POST requests to `send a query`
```javascript
import pool from "@/app/lib/db"

export async function POST (
  request: NextRequest,
) {
  try {
    await pool.query(`<QUERY>`);
    return NextResponse.json({
      success: true,
      code: 201,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `${error.message}`,
      code: 500,
    })
  }
}
```




✔️
❌