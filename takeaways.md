# Key Takeaways

## Table of contents
1. [ReCAPTCHA in Next.js + React](#recaptcha-in-nextjs-app-router--react)
2. [Connect local PostgreSQL database for testing in Next.js (App Router) + React](#connect-local-postgresql-database-for-testing-in-nextjs-app-router--react)
   1. [Make a request to the local database using a custom API endpoint](#make-a-request-to-the-local-database-using-a-custom-api-endpoint)
3. [Signup feature using traditional credentials model (username + password with Next.js + React)](#signup-feature-using-traditional-credentials-model-username--password-with-nextjs--react)
   1. [Custom React hook](#custom-react-hook)
   2. [Route Handler](#route-handler)
   3. [UI Component](#ui-component)
---
## **ReCAPTCHA in Next.js (App Router) + React**

**1. Sign up for an API key pair and in this specific case, choose the client-side integration `reCAPTCHA v3`**. *[Google reCAPTCHA intro](https://developers.google.com/recaptcha/intro)*

**2. Load the JavaScript API with sitekey at root `Layout`**
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

**3. Create React custom hook to:**
  - Check availability of the Window object and return boolean State
  - Implement a handler function to use `grecaptcha.execute` and get the token
  - Verify form data input
  - Make a POST request to custom API endpoint
  - Provide a state `isSubmitting`

**4. At `UI component`**
  - Using the React custom hook:
    - Conditionally render component based on Window Object's availability state
    - On `<form>` use attribute `onSubmit` with the handler function provided by the React custom hook
    - On `<form>` set attribute `method` to `POST`

**5. At `Route Handler`**
  - Create `POST` function to handle the request
  - Parse the **`JSON request`** and produce JavaScript object
  ```javascript
  const object = await request.json();
  ```
  - Fetch to the endpoint: *"https://www.google.com/recaptcha/api/siteverify"*
    - **METHOD**: `POST`
    - BODY as `new URLSearchParams`
    - **secret**: `<Google Secret key>` *(required)*
    - **response**: `<reCAPTCHA token>` *(required)*
    - **remoteip**: The user's IP address *(optional)*
  - Parse **`JSON response`** and produce JavaScript object
  ```javascript
  const verification = await verify.json();
  ```

## **Connect local PostgreSQL database for testing in Next.js (App Router) + React**

**1. Download PostgreSQL** *[Download here](https://www.postgresql.org/download/)*
  - Create a database and a table either through the **`PSQL`** or the Query tool interface (**`pgAdmin`**)
  - Through *pgAdmin*:
    > Object -> Create -> Server Group... -> *Set name*
    - On server created, right clic:
    > Register -> Server... -> Connection
      - Set `Host name`, `Port`, `Maintenance database`, `Username`, `Password`

**2. Create `.env.local` file**
  - Set environment variables, e.g.:
    ```
    DB_USER="postgres"
    DB_HOST="localhost"
    DB_NAME="project"
    DB_PASSWORD=<password>
    DB_PORT="5432"
    ```
**3. Install node-postgres**
  ```
  $ npm install pg
  ```
**4. Create a file `db.ts` and connect to the local database**
```javascript
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432, // This is set without the environment variable because the value must be a number, not a string.
});

export default pool;
```

### Make a request to the local database using a custom API endpoint

Inside the `app` folder
**1. Create an `Action Handler` inside the working route segment**
  > await fetch(*&lt;URLendpoint&gt;*, { *&lt;any payload&gt;* })

**2. Create custom endpoint**
  > *app/api/&lt;route&gt;/route.ts*

**3. Create function for POST requests to `send a query` at `route.ts`**
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
## Signup feature using traditional credentials model (username + password) with Next.js + React

### Custom React hook
+ Custom hook handles React States for status such as *submitting* and *error*.
  + **Submit handler** for signing up.
    + Makes a **POST** request to the `/api/signup` endpoint with the `FormData` keys/values within the `body`, formatted with **`JSON.stringify()`**.

### Route Handler

+ Receives the `NextRequest` and converts it with `.json()`.
+ **Hashes password** with `Argon2id`.
  + Utility used: `Oslo`.
    ```
    npm i oslo
    ```
    ```javascript
    import { Argon2id } from "oslo/password";
    // ...
    const argon2id = new Argon2id()
    const password = await argon2id.hash(incoming.password);
    // ...
    ```
> [!NOTE]
> `Argon2` is the award winner of [**Password Hashing Competition**](https://en.wikipedia.org/wiki/Password_Hashing_Competition) of 2015. Having three versions,
> the recommended version to use is `Argon2id` which has different parameters that can be configured, such as: *memorize size, iterations, parallelism, and secret*.
> Argon2id provides a balanced approach to resisting both `side-channel` and `GPU-based attacks`[^1].
+ Makes a **SQL Query** to **INSERT** the values into the table.
> [!IMPORTANT]
> `Parameterized queries` are important to avoid **SQL Injections** instead of using *template literals*. Example:
> ```javascript
> await pool.query(`
>    INSERT INTO scheduler_users (name, username, email, birthday, password)
>        VALUES (
>            $1,
>            $2,
>            $3,
>            $4,
>            $5
>        )
>  `, [name, username, email, birthday, password]);
> ```

### UI Component

+ The component apart from other features (*displaying password requirements, reveal the password function, etc.*) sets the **onSubmit** property with the **Submit Handler** provided by the custom React hook and sets **method** to **POST**  on the **<form>** element.
  ```javascript
  // ...
  <form onSubmit={<Submit Handler>} method="POST">
  // ...
  ```
> [!NOTE]
> *Personal notes:*
> + `bcrypt` is used **client-side while** `argon2` is used **server-side**.
> + While hashing passwords in the signing up process, it is unecessary to hash passwords client-side as the `HTTPS protocol` encrypts the data sent to the server. **Hashing passwords is better done server-side**.
> + In this scenario, it is important to implement `rate-limiting`, `2FA` and the `password reset` option for the user.

✔️❌
[^1]: [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
