import "server-only";
import NextAuth from "next-auth";
import { AuthError } from "@auth/core/errors";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import pool from "./app/lib/mocks/db";
import { sql } from "@vercel/postgres";
import type {
  Account,
  Profile,
  Session,
  User,
} from "@auth/core/types";
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { verifyPassword } from "./app/lib/argon-server";

interface Token {
    googleAccessToken?: string;
    facebookAccessToken?: string;
    googleSub?: string;
    facebookSub?: string;
    username?: string;
    image?: string;
    id?: string;
    sub?: null | string;
    name?: string;
    email?: string;
}
export const { handlers, signIn, signOut, auth } = (NextAuth as any)({
    secret: process.env.AUTH_SECRET,
    providers: [
        Google({
            async profile(profile) {
                try {
                    const doesUserExist = await sql`
                    SELECT 
                        scheduler_users.id as user_id, 
                        scheduler_users_providers.provider
                    FROM 
                        (SELECT ${profile.email} AS email) AS input
                    LEFT JOIN 
                        scheduler_users ON input.email = scheduler_users.email
                    LEFT JOIN
                        scheduler_users_providers ON scheduler_users.email = scheduler_users_providers.email 
                        AND scheduler_users_providers.provider = 'Google';
                    `;
                    const data = doesUserExist.rows[0];
                    // If the user exists AND it already has signed in with provider, return profile
                    if (data.user_id && data.provider) {
                        profile.id = data.user_id;
                        profile.image = profile.picture;
                        return { ...profile };
                    }
                    // If the user exist BUT hasn't signed in with provider,
                    // Add provider into table AND update the users' profile picture
                    if (data.user_id && data.provider === null) {
                        const registerUserProvider = await sql`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                ${profile.email},
                                'Google'
                            );
                        `;
                        const insertProfilePicture = await sql`
                            UPDATE scheduler_users
                            SET user_image = ${profile.picture}
                            WHERE email = ${profile.email} AND user_image IS NULL;
                        `;
                        profile.id = data.user_id;
                        profile.image = profile.picture;
                        return { ... profile };
                    }
                    // If the user does not exist
                    if (data.user_id === null && data.provider === null) {
                        const registerUser = await sql`
                            INSERT INTO scheduler_users (name, username, email, user_image)
                            VALUES (
                                ${profile.name},
                                ${profile.name},
                                ${profile.email},
                                ${profile.picture}
                            )
                            ON CONFLICT (username) DO NOTHING
                            RETURNING id;
                        `;
                        const registerUserProvider = await sql`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                ${profile.email},
                                'Google'
                            );
                        `;
                        profile.id = data.user_id;
                        profile.image = profile.picture;
                        return { ... profile };
                    }
                    return { 
                        id: "",
                        name: "",
                        email: "",
                        image: "",
                    };
                } catch (error) {
                    console.error("Error during signup API call:", error);
                    return { 
                        id: "",
                        name: "",
                        email: "",
                        image: "",
                    };;
                }
            }
        }),
        Facebook({
            authorization: {
                params: {
                    response_type: "code",
                },
            },
            async profile(profile) {
                try {
                    const doesUserExist = await sql`
                    SELECT 
                        scheduler_users.id as user_id, 
                        scheduler_users_providers.provider
                    FROM 
                        (SELECT ${profile.email} AS email) AS input
                    LEFT JOIN 
                        scheduler_users ON input.email = scheduler_users.email
                    LEFT JOIN
                        scheduler_users_providers ON scheduler_users.email = scheduler_users_providers.email 
                        AND scheduler_users_providers.provider = 'Facebook';
                    `;
                    const data = doesUserExist.rows[0];
                    // If the user exists AND it already has signed in with provider, return profile
                    if (data.user_id && data.provider) {
                        profile.id = data.user_id;
                        profile.image = profile.picture.data.url;
                        return { ...profile };
                    }
                    // If the user exist BUT hasn't signed in with provider,
                    // Add provider into table AND update the users' profile picture
                    if (data.user_id && data.provider === null) {
                        const registerUserProvider = await sql`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                ${profile.email},
                                'Facebook'
                            );
                        `;
                        const insertProfilePicture = await sql`
                            UPDATE scheduler_users
                            SET user_image = ${profile.picture.data.url}
                            WHERE email = ${profile.email} AND user_image IS NULL;
                        `;
                        profile.id = data.user_id;
                        profile.image = profile.picture.data.url;
                        return { ... profile };
                    }
                    // If the user does not exist
                    if (data.user_id === null && data.provider === null) {
                        const registerUser = await sql`
                            INSERT INTO scheduler_users (name, username, email, user_image)
                            VALUES (
                                ${profile.name},
                                ${profile.name},
                                ${profile.email},
                                ${profile.picture.data.url}
                            )
                            ON CONFLICT (username) DO NOTHING
                            RETURNING id;
                        `;
                        const registerUserProvider = await sql`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                ${profile.email},
                                'Facebook'
                            );
                        `;
                        profile.id = data.user_id;
                        profile.image = profile.picture.data.url;
                        return { ... profile };
                    }
                    return { 
                        id: "",
                        name: "",
                        email: "",
                        image: "",
                    };
                } catch (error) {
                    console.error("Error during signup API call:", error);
                    return { 
                        id: "",
                        name: "",
                        email: "",
                        image: "",
                    };
                }
            }
        }),
        Credentials({
            credentials: {
                username: { label: "Username or e-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const username = credentials.username;
                const password = credentials.password;
                console.log(credentials)
                if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
                    throw new Error("Data missing", { cause: 400 });
                }
                // Gather data if user exists
                const user = await sql`
                    SELECT 
                        id, 
                        name, 
                        username, 
                        email, 
                        password,
                        user_image
                    FROM scheduler_users
                    WHERE email = ${username} OR username = ${username};
                `;
                // User not found
                if (!user.rowCount) {
                    throw new AuthError("User not found", {
                        cause: 404
                    });
                }
                // Check if user's account is locked
                const isUserLocked = await sql`
                    SELECT next_attempt_allowed_at 
                    FROM scheduler_login_attempts
                    WHERE email = ${user.rows[0].email}
                    AND next_attempt_allowed_at > NOW();
                `;
                
                // User's account is locked
                if (isUserLocked.rowCount) {
                    const next_attempt = isUserLocked.rows[0].next_attempt_allowed_at;
                    throw new AuthError("Account currently locked", { cause: { next_attempt } });
                }
                if (user.rows[0].password === null) {
                    // If decrypted password is null check if user is registered with a provider
                    const userProvider = await sql`
                        SELECT provider FROM scheduler_users_providers
                        WHERE email = ${user.rows[0].email};
                    `;
                    if (!userProvider.rows.length) {
                        // If the user's password is NULL and it hasn't signed in with a provider, then the registration is incorrect.
                        throw new AuthError("Bad registry", {
                            cause: 409
                        });
                    } else {
                        throw new AuthError("User does not have credentials but have signed in with external provider", { cause: 402 });
                    }
                }
                // If it is not null, verify the hashed decrypted password
                const userKey = await sql`
                    SELECT user_password_key FROM scheduler_users
                    WHERE email = ${username} OR username = ${username};
                `;
                if (userKey.rowCount === 0) {
                    throw new AuthError("Bad registry", {
                        cause: 409
                    })
                }
                const passwordKey = userKey.rows[0].user_password_key;

                const accessKeyId: string = process.env.AWS_KMS_KEY!;
                const secretAccessKey: string = process.env.AWS_KMS_SECRET!;
                const KeyId: string = process.env.AWS_KMS_ARN!;

                const client = new KMSClient({
                    region: "us-east-1",
                    credentials: {
                        accessKeyId,
                        secretAccessKey,
                    },
                });
                const command = new DecryptCommand({
                    CiphertextBlob: Buffer.from(passwordKey, "base64"), // Convert to Buffer
                    KeyId,
                });
                const result = await client.send(command);
                const key = Buffer.from(result.Plaintext ?? "").toString("base64");
                
                if (!key) {
                    throw new AuthError("Null KMS", { cause: 500 })
                }
                const decryptedPassword = await sql`
                    SELECT pgp_sym_decrypt_bytea(password, ${key}) AS decrypted_password
                    FROM scheduler_users
                    WHERE email = ${username} OR username = ${username};
                `;
                if (decryptedPassword.rowCount === 0) {
                    throw new AuthError("Internal Error", { cause: 500 });
                }
                const decrypted = decryptedPassword.rows[0].decrypted_password.toString();
                const isValid = await verifyPassword(decrypted, password);
                if (!isValid) { 
                    // If verification fails, insert registry to login_attempts
                    const attempt = await sql`
                        INSERT INTO scheduler_login_attempts (email, created_at, last_attempt_at, next_attempt_allowed_at, attempts)
                        VALUES (${user.rows[0].email}, NOW(), NOW(), NOW() + INTERVAL '1 minute', 1)
                        ON CONFLICT (email) 
                        DO UPDATE SET 
                            last_attempt_at = NOW(),
                            next_attempt_allowed_at = NOW() + (scheduler_login_attempts.attempts * INTERVAL '1 minute'),
                            attempts = scheduler_login_attempts.attempts + 1
                        RETURNING next_attempt_allowed_at;
                    `;
                    const next_attempt = attempt.rows[0].next_attempt_allowed_at;
                    throw new AuthError("Invalid credentials", { cause: { next_attempt } })
                }
                await sql`
                    DELETE FROM scheduler_login_attempts WHERE email = ${user.rows[0].email};
                `;
                return {
                    id: user.rows[0].id,
                    name: user.rows[0].name,
                    username: user.rows[0].username,
                    email: user.rows[0].email,
                    image: user.rows[0].user_image,
                }
            },
        }),
    ],
    callbacks: {
        async authorized ({ auth }: { auth: null | Session }) {
            return !!auth;
        },
        async jwt ({ token, account, profile, user }: {
            token: Token
            account: Account,
            profile: Profile,
            user: User,
        }) {
            if (account && profile) {
                const provider = account.provider;
                const isGoogle = provider === 'google';
                const isFacebook = provider === 'facebook';
                
                if (profile.user_image) {
                    token.image = profile.user_image as string;
                }
                if (isGoogle || isFacebook) {
                    if (isGoogle) {
                        token.googleAccessToken = account.access_token;
                        token.googleSub = account.providerAccountId;
                    } else if (isFacebook) {
                        token.facebookAccessToken = account.access_token;
                        token.facebookSub = account.providerAccountId;
                    }
                }
                token.id = profile.id as string;
                if (user) {
                    token.name = user.name;
                    token.username = user.username;
                    token.email = user.email;
                    token.image = user.image as string;
                    if (isGoogle || isFacebook) {
                        token.id = account.providerAccountId;
                    } else {
                        token.id = user.id;
                    }
                }
            }
            return token;
        },
        async session ({ session, token }: {
            session: Session,
            token: Token,
        }) {
            session.user = session.user || {};
            
            if (token.image) {
                session.user.image = token.image;
            }
            if (token.username) {
                session.user.username = token.username;
            }
            if (token.googleAccessToken && token.googleSub) {
                session.googleAccessToken = token.googleAccessToken;
                session.user.googleSub = token.googleSub;
                session.user.id = token.googleSub;
            }
            if (token.facebookAccessToken && token.facebookSub) {
                session.facebookAccessToken = token.facebookAccessToken;
                session.user.facebookSub = token.facebookSub;
                session.user.id = token.facebookSub;
            }
            if (!token.googleSub && !token.facebookSub && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
            const defaultLocale = "en";
            const urlObject = new URL(url, baseUrl);
            const pathnameParts = urlObject.pathname.split("/");

            const isLocalePresent = ["es", "en"].includes(pathnameParts[1]);
            const locale = isLocalePresent ? pathnameParts[1] : defaultLocale;

            if (url.startsWith("/login")) {
                return `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/login`;
            }
            return url;
        },
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    debug: true,
})