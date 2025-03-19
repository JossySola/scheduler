import "server-only";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import pool from "./app/lib/mocks/db";
import { Argon2id } from "oslo/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            async profile(profile) {
                try {
                    const doesUserExist = await pool.query(`
                      SELECT scheduler_users.id, scheduler_users_providers.provider
                      FROM scheduler_users 
                      LEFT JOIN scheduler_users_providers
                      ON scheduler_users.email = scheduler_users_providers.email
                      WHERE scheduler_users.email = $1
                      AND (scheduler_users_providers.provider = $2 OR scheduler_users_providers.provider IS NULL);
                    `, [profile.email, 'Google']);
                    if (doesUserExist.rows.length > 0 && doesUserExist.rows[0].provider === 'Google') {
                        profile.id = doesUserExist.rows[0].id;
                        profile.image = profile.picture;
                        return { ... profile };
                    }
                    if (doesUserExist.rows.length > 0 && doesUserExist.rows[0].provider === null) {
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            );
                        `, [profile.email, 'Google']);
                        if (registerUserProvider.rowCount !== 0) {
                            profile.id = doesUserExist.rows[0].id;
                            profile.image = profile.picture;
                            return { ... profile };
                        }
                    }
                    if(doesUserExist.rowCount === 0) {
                        const registerUser = await pool.query(`
                            INSERT INTO scheduler_users (name, username, email, user_image)
                            VALUES (
                                $1,
                                $1,
                                $2,
                                $3
                            )
                            RETURNING id;
                        `, [profile.name, profile.email, profile.picture]);
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            )
                            ON CONFLICT (email, provider) DO NOTHING;
                        `, [profile.email, 'Google']);
                        if (registerUser.rowCount && registerUserProvider.rowCount) {
                            profile.id = registerUser.rows[0].id;
                            profile.image = profile.picture;
                            return { ...profile };
                        }
                    }
                } catch (error) {
                    console.error("Error during signup API call:", error);
                }
            }
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
            async profile(profile) {
                try {
                    const doesUserExist = await pool.query(`
                      SELECT scheduler_users.id, scheduler_users_providers.provider
                      FROM scheduler_users 
                      LEFT JOIN scheduler_users_providers
                      ON scheduler_users.email = scheduler_users_providers.email
                      WHERE scheduler_users.email = $1
                      AND (scheduler_users_providers.provider = $2 OR scheduler_users_providers.provider IS NULL);
                    `, [profile.email, 'Facebook']);
                    if (doesUserExist.rows.length > 0 && doesUserExist.rows[0].provider === 'Facebook') {
                        profile.id = doesUserExist.rows[0].id;
                        profile.image = profile.picture.data.url;
                        return { ... profile };
                    }
                    if (doesUserExist.rows.length > 0 && doesUserExist.rows[0].provider === null) {
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            )
                            ON CONFLICT (email, provider) DO NOTHING;
                        `, [profile.email, 'Facebook']);
                        if (registerUserProvider.rowCount !== 0) {
                            profile.id = doesUserExist.rows[0].id;
                            profile.image = profile.picture.data.url;
                            return { ... profile };
                        }
                    }
                    if(doesUserExist.rowCount === 0) {
                        const registerUser = await pool.query(`
                            INSERT INTO scheduler_users (name, username, email, user_image)
                            VALUES (
                                $1,
                                $1,
                                $2,
                                $3
                            )
                            RETURNING id;
                        `, [profile.name, profile.email, profile.picture.data.url]);
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            )
                            ON CONFLICT (email, provider) DO NOTHING;
                        `, [profile.email, 'Facebook']);
                        if (registerUser.rowCount && registerUserProvider.rowCount) {
                            profile.id = registerUser.rows[0].id;
                            profile.image = profile.picture.data.url;
                            return { ...profile };
                        }
                    }
                } catch (error) {
                    console.error("Error during signup API call:", error);
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

                if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
                    throw new Error("Data missing");
                }
                const secret: string | undefined = process.env.NEXTAUTH_SECRET;
                if (!secret) throw new Error("Data missing");

                const user = await pool.query(`
                    SELECT 
                    id, 
                    name, 
                    username, 
                    email, 
                    pgp_sym_decrypt_bytea(password, $2) AS decrypted_password,
                    user_image
                    FROM scheduler_users
                    WHERE email = $1 OR username = $1;
                `, [username, secret]);
                if (!user.rowCount) throw new Error("User not found");
                
                if(user.rows[0].password === null) {
                    const userProvider = await pool.query(`
                        SELECT provider FROM scheduler_users_providers
                        WHERE email = $1;
                    `, [username]);
                    if (!userProvider.rowCount) throw new Error("Bad registry");
                }
                
                const isUserLocked = await pool.query(`
                    SELECT next_attempt_allowed_at 
                    FROM scheduler_login_attempts
                    WHERE email = $1
                    AND next_attempt_allowed_at > NOW();
                `, [username]);
                if (isUserLocked.rowCount) throw new AuthError("Account currently locked", { cause: { next_attempt: isUserLocked.rows[0].next_attempt_allowed_at }});

                const argon2id = new Argon2id();
                const verification = await argon2id.verify(user.rows[0].decrypted_password.toString(), password);
                if (!verification) throw new Error("Invalid credentials");
                
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
        async jwt ({ token, account, profile, user }) {
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

            }
            if (user) {
                token.name = user.name;
                token.username = user.username;
                token.email = user.email;
                token.image = user.image as string;
                token.id = user.id;
            }
            return token;
        },
        async session ({ session, token }) {
            session.user = session.user || {};

            if (token.image) {
                session.user.image = token.image;
            }
            if (token.id) {
                session.user.id = token.id;
            }
            if (token.username) {
                session.user.username = token.username;
            }
            if (token.googleAccessToken && token.googleSub) {
                session.googleAccessToken = token.googleAccessToken;
                session.user.googleSub = token.googleSub;
            }
            if (token.facebookAccessToken && token.facebookSub) {
                session.facebookAccessToken = token.facebookAccessToken;
                session.user.facebookSub = token.facebookSub;
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            const defaultLocale = "en";
            const urlObject = new URL(url, baseUrl);
            const pathnameParts = urlObject.pathname.split("/");

            const isLocalePresent = ["es", "en"].includes(pathnameParts[1]);
            const locale = isLocalePresent ? pathnameParts[1] : defaultLocale;

            if (url.startsWith("/login")) {
                return `/${locale}/login`;
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