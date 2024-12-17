# Key Takeaways

## Table of contents
1. [ReCAPTCHA in Next.js + React](#recaptcha-in-nextjs-app-router--react)
2. [Connect local PostgreSQL database for testing in Next.js (App Router) + React](#connect-local-postgresql-database-for-testing-in-nextjs-app-router--react)
   - [Make a request to the local database using a custom API endpoint](#make-a-request-to-the-local-database-using-a-custom-api-endpoint)
3. [Signup feature using traditional credentials model (username + password) with Next.js + React](#signup-feature-using-traditional-credentials-model-username--password-with-nextjs--react)
4. [Authentication Guidance](#authentication-guidance)
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
    
    On server created, right click:
    
    > Register -> Server... -> Connection

    Set `Host name`, `Port`, `Maintenance database`, `Username`, `Password`

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

**1. Custom React hook**
   + Custom hook handles React States for status such as *submitting* and *error*.
     + **Submit handler** for signing up.
       + Makes a **POST** request to the `/api/signup` endpoint with the `FormData` keys/values within the `body`, formatted with `JSON.stringify()`.

**2. At `route.ts`**
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
   + Makes a **SQL Query** to **INSERT** the values into the table.

> [!NOTE]
> `Argon2` is the award winner of [**Password Hashing Competition**](https://en.wikipedia.org/wiki/Password_Hashing_Competition) of 2015. Having three versions,
> the recommended version to use is `Argon2id` which has different parameters that can be configured, such as: *memory size, iterations, parallelism, and secret*.
> Argon2id provides a balanced approach to resisting both `side-channel` and `GPU-based attacks`[^1].

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

**3. At `UI Component`**
   + The component apart from other features (*displaying password requirements, reveal the password function, etc.*) sets the **onSubmit** property with the **Submit Handler** provided by the custom React hook and sets **method** to **POST**  on the `<form>` element.
     ```javascript
     // ...
     <form onSubmit={submitHandler} method="POST">
     // ...
     ```
> [!NOTE]
> *Personal notes:*
> + `bcrypt` is used **client-side** while `argon2` is used **server-side**.
> + While hashing passwords in the signing up process, it is unecessary to hash passwords client-side as the `HTTPS protocol` encrypts the data sent to the server. **Hashing passwords is better done server-side**.
> + In this scenario, it is important to implement `rate-limiting`, `2FA` and the `password reset` option for the user.

## Authentication Guidance
### Notes from [Passwords Evolved](https://www.troyhunt.com/passwords-evolved-authentication-guidance-for-the-modern-era/) article.

+ *National Institute of Standards and Technologies (NIST)*
+ *National Cyber Security Centre (NCSC)*
+ *Microsoft's Password Guidance*

> Verifiers SHOULD permit subscriber-chosen memorized secrets (passwords) at least 64 characters in length - **NIST**

> [!CAUTION]
> Limiting the users with anti-patterns such as short arbitrary lengths (*e.g. password must be 8-10 characters*), mandatory patterns (*e.g. password must begin with capital letter and end with a number*) **MUST BE AVOIDED** as it kills `password managers` and usability.
>
> Even though the length recommendation for a password is from 8 to 64 characters, the length is fixed once it is hashed down.
---

> Truncation of the secret SHALL NOT be performed - **NIST**

Do NOT have a short arbitrary password length and don't chop characters off the end of the password provided by the user.

---
There should not be a limitation on the characters allowed to be used. Certain characters are disallowed to prevent potential attacks such as angle brackets in `XSS attacks`, however, passwords should never be re-displayed in the UI where an XSS risk could be exploited and they should never be sent to the database without being hashed which would mean only alphanumeric characters prevail.

> All printing ASCII [RFC20] characters as well as the space character SHOULD be acceptable in memorized secrets, Unicode [ISO/ISC 10646] characters SHOULD be accepted as well. - **NIST**

---

> Verifiers SHOULD NOT impose other composition rules (*e.g. requiring mixtures of different character types or prohibiting consecutively repeated characters*) for memorized secrets. - **NIST**

Requirements such as having capital letters, a number, an special character, etc. leave scope to use passwords such as "Password!" and rule out passwords such as lowercase passphrases. **Eliminate character-composition requirements**.

> Most people use similar patterns (*i.e. capital letter in the first position, a symbol in the last, and a number in the last 2*). Cyber criminals know this, so they run their dictionary attacks using the common substitutions, such as "$" for "s", "@" for "a", "1" for "l", and so on. - **Microsoft**

---

> Memorized secret verifiers SHALL NOT permit the subscriber to store a "hint" that is accessible to an unauthenticated claimant. - **NIST**

---

Having in mind that passwords:
+ Must be "strong", the longer and more random, the better.
+ Should'nt be reused

And consequently following both bullet points, users simply cannot just memorize the passwords used across different services. This is why **`Password Managers`** are important to embrace.

> ### Help users cope with 'password overload' - NCSC
> + Only use passwords where they are really needed.
> + Use technical solutions to reduce the burden on users.
> + **Allow users to securely record and store their passwords.**
> + **Only ask users to change their passwords on indication of suspicion of compromise.**
> + Allow users to reset password easily, quickly and cheaply.

> You should also provide appropriate facilities to store recorded passwords, with protection appropriate to the sensitivity of the information being secured. Storage could be physical or technical, or a combination of both. The important thing is that your organization provides a sanctioned mechanism to help users manage passwords, as this will deter users from adopting insecure "hidden" methods to manage password overload - **NCSC**

---

> Verifiers SHOULD permit claimants to use "paste" functionality when entering a memorized secret. This facilitates the use of password managers, which are widely used and in many cases increase the likelihood that users will choose stronger memorized secrets. - **NIST**

> [!TIP]
> Let users copy-paste passwords.

---

> Password expiration (**requiring the user to change their password periodically*) policies do more harm than good, because these policies drive users to very predictable passwords composed of sequential words and numbers which are closely related to each other (*that is, the next password can be predicted based on the previous password*). Password change offers no containment benefits cyber criminals almost always use credentials as soon as they compromise them. - **Microsoft**

> [!TIP]
> Notifying users with details of attempted logins, successful or unsuccessful; they should report any for which they were not responsible - **NCSC**
> 
> Notify users of abnormal behaviour while also always offering the options to sign out (*`de-authenticate`*) from the devices they are currently logged in.


---

> When processing requests to establish and change memorized secrets, verifiers SHALL compare the prospective secrets against a list that contains values known to be commonly*used, expected, or compromised. For example, the list MAY include, but is not limited to: Passwords obtained from previous breach corpuses. - **NIST**

> [!TIP]
> Block previously breached passwords.
> 
> Example: Use [have i been pwned](https://haveibeenpwned.com/API/v3) API.

---
✔️❌
[^1]: [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
