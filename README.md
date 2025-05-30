# Scheduler ![icon](https://github.com/user-attachments/assets/3e67832e-a757-44cc-a4a9-ded4055057c4) 
## Description

I thought of this project after I realized the managers at my current job (*retail store*) were struggling with schedule planification as we are more than 40 employees.

The issue arises as each employee has unique requirements and needs. That is what each row and column specification is for.

This fullstack web application handles `authentication`, `authorization`, as well as **fetching**, **inserting**, **modifying**, and **erasing data** from/to the database through `Route Handlers` as `API endpoints` while also utilizing `Server Actions` in form submissions. The user's data is stored and handled in a `PostgreSQL` database. As for security, `AWS KMS` encryption and `Argon hashing` are used to protect: user's password, user's tables, values, and specifications.

It configures a `middleware` to manage requests to handle *internationalization*, and redirection if the user has a session active. In addition, `Auth.js` is used to handle `sessions` from `Credentials`, `Google` or `Facebook` sign in.

Furthermore, the application uses external APIs such as `Sendgrid` and `Emailjs`, as well as the `Anthropic` Claude AI model in order to generate a schedule based on the given criteria.

I'm eager to say that I plan to keep adding new features as I have some in mind already.

## Stack
### Programming Language
- TypeScript
### Frameworks
- Next JS
- Tailwind CSS
- Vitest
### Libraries
- React
- HeroUI
- Framer Motion
- Zod
- Auth.js
### SDKs
- Anthropic AI
- AWS KMS
### APIs
- Email JS
- SendGrid
### Utilities
- Oslo
- use-debounce
