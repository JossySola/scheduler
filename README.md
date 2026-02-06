# Scheduler <img width="32" height="32" alt="icon" src="https://github.com/user-attachments/assets/baa2a494-0e9b-4940-a378-667e8847969f" />
An AI-powered strategic scheduling application that generates personalized schedules based on user specifications and values using Anthropic's Claude AI.

## Overview
Scheduler is a Next.js web application that leverages advanced AI capabilities to create customized, strategic schedules tailored to individual needs. By understanding user goals, constraints, and priorities, the application generates intelligent scheduling recommendations that align with personal or professional objectives.

## Features
- **AI-Driven Schedule Generation**: Utilizes Anthropic's Claude AI to create context-aware schedules.
- **User Authentication**: Secure authentication system powered by `NextAuth.js`.
- **Personalized Scheduling**: Customizes schedules based on user-provided specifications and values.
- **Modern UI**: Built with `HeroUI` and `Tailwind CSS` for a responsive, intuitive interface.
- **Dark Mode Support**: Themes switches based on the user's system preferences.
- **Database Integration**: `PostgreSQL` database with `Vercel Postgres`.
- **Analytics**: Built-in `Vercel Analytics` and `Speed Insights`.

## Tech Stack
### Front-end
- **Programming language**: TypeScript
- **Framework**: Next.js (with Turbopack)
- **Library**: React
- **UI Library**: HeroUI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion & Lottie animations
- **Date Handling**: @internationalized/date
- **Virtualization**: TanStack React Table

### Back-end
- **Runtime**: Node.js
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL via Vercel Postgres
- **ORM**: @auth/pg-adapter
- **Password Hashing**: Argon2

### AI Integration
- **AI SDK**: Vercel AI SDK
- **AI Provider**: Anthropic Claude (via @ai-sdk/anthropic)
- **AI Features**: Real-time AI streaming responses

### Security
- **Encryption**: AWS KMS Integration
- **Password Security**: Argon2 Hashing
- **Environment Variables**: dotenv configuration

### Development Tools:
- **Language**: TypeScript
- **Testing**: Vitest with coverage
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm

## Project Structure
```
scheduler/
├── app/                            # Next.js app directory
│   ├── [lang]                      # App routes
│   ├── api/                        # API routes
│   │   ├── argon2/
│   │   │   └── verify.ts           # Password verification
│   │   ├── auth/
│   │   │   └── [...nextauth]       # 
│   │   ├── cron/                   # Cron job to clean up database tables
│   │   ├── generate/
│   │   │   ├── route.ts            # POST route to utilize the AI SDK
│   │   │   └── schema.ts           # Zod schema
│   │   └── signup/                 # POST signup process into database
│   ├── fonts/
│   ├── hooks/
│   │   └── custom.ts               # React custom hooks
│   ├── lib/
│   │   ├── definitions.ts          # Type definitions
│   │   ├── generation-worker.ts    # Web worker (deprecated)
│   │   ├── response.ts             # Response handler class
│   │   ├── utils-client.ts         # Client-side utils
│   │   └── utils.ts                # Server-side utils
│   ├── ui/
│   │   ├── atoms/                  # 1 part components
│   │   ├── molecules/              # 2+ part components
│   │   ├── landing/                # Landing page components
│   │   ├── v4/                     # HeroUI components
│   │   └── icons                   # Geist SVG icons
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── providers.tsx
│   ├── scheduler_loader.json
│   └── template.tsx
├── auth.ts                         # Authentication
└── proxy.ts                        # Middleware
```
