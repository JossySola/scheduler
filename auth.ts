import "server-only";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: new Pool({
        database: process.env.PGDATABASE,
        user: 'scheduler',
        password: process.env.PGPASSWORD,
        port: parseInt(process.env.PGPORT as string, 10),
        ssl: true,
        max: 20, // set pool max size to 20
        idleTimeoutMillis: 1000, // close idle clients after 1 second
        connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
        maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        facebook: {
            clientId: process.env.AUTH_FACEBOOK_ID as string,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET as string,
        },
        google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        }
    },
    plugins: [nextCookies()],
});