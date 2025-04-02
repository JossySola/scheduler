import "server-only";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import pool from "./app/lib/mocks/db";
import { Argon2id } from "oslo/password";
import { decryptKmsDataKey } from "./app/lib/utils";

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
                    if (doesUserExist.rows.length > 0 && doesUserExist.rows[0].provider !== 'Google') {
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            );
                        `, [profile.email, 'Google']);
                        const insertProfilePicture = await pool.query(`
                            UPDATE scheduler_users
                            SET user_image = $1
                            WHERE email = $2 AND user_image IS NULL;
                        `, [profile.picture, profile.email]);
                        if (registerUserProvider.rowCount !== 0) {
                            profile.id = doesUserExist.rows[0].id;
                            profile.image = profile.picture;
                            return { ... profile };
                        }
                    }
                    if(doesUserExist.rows.length === 0) {
                        const registerUser = await pool.query(`
                            INSERT INTO scheduler_users (name, username, email, user_image)
                            VALUES (
                                $1,
                                $2,
                                $3,
                                $4
                            )
                            ON CONFLICT (username) DO NOTHING
                            RETURNING id;
                        `, [profile.name, profile.name, profile.email, profile.picture]);
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            );
                        `, [profile.email, 'Google']);
                        let userId =registerUser.rows[0]?.id;
                        if (!userId) {
                            const existingUser = await pool.query(`
                               SELECT id FROM scheduler_users WHERE username = $1; 
                            `, [profile.name]);
                            userId = existingUser.rows[0]?.id;
                        }
                        if (registerUser.rowCount || registerUserProvider.rowCount) {
                            profile.id = userId;
                            profile.image = profile.picture;
                            return { ...profile };
                        }
                        return { ... profile };
                    }
                } catch (error) {
                    console.error("Error during signup API call:", error);
                    return null;
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
                    if (doesUserExist.rows.length > 0 && doesUserExist.rows[0].provider !== 'Facebook') {
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            );
                        `, [profile.email, 'Facebook']);
                        const insertProfilePicture = await pool.query(`
                            UPDATE scheduler_users
                            SET user_image = $1
                            WHERE email = $2 AND user_image IS NULL;
                        `, [profile.picture.data.url, profile.email]);
                        if (registerUserProvider.rowCount !== 0) {
                            profile.id = doesUserExist.rows[0].id;
                            profile.image = profile.picture.data.url;
                            return { ... profile };
                        }
                    }
                    if(doesUserExist.rows.length === 0) {
                        const registerUser = await pool.query(`
                            INSERT INTO scheduler_users (name, username, email, user_image)
                            VALUES (
                                $1,
                                $2,
                                $3,
                                $4
                            )
                            ON CONFLICT (username) DO NOTHING
                            RETURNING id;
                        `, [profile.name, profile.name, profile.email, profile.picture.data.url]);
                        const registerUserProvider = await pool.query(`
                            INSERT INTO scheduler_users_providers (email, provider)
                            VALUES (
                                $1,
                                $2
                            );
                        `, [profile.email, 'Facebook']);
                        let userId =registerUser.rows[0]?.id;
                        if (!userId) {
                            const existingUser = await pool.query(`
                               SELECT id FROM scheduler_users WHERE username = $1; 
                            `, [profile.name]);
                            userId = existingUser.rows[0]?.id;
                        }
                        if (registerUser.rowCount || registerUserProvider.rowCount) {
                            profile.id = userId;
                            profile.image = profile.picture.data.url;
                            return { ...profile };
                        }
                        return { ... profile };
                    }
                } catch (error) {
                    console.error("Error during signup API call:", error);
                    return null;
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
                
                // Gather data if user exists
                const user = await pool.query(`
                    SELECT 
                    id, 
                    name, 
                    username, 
                    email, 
                    password,
                    user_image
                    FROM scheduler_users
                    WHERE email = $1 OR username = $1;
                `, [username, secret]);
                // User not found
                if (!user.rowCount) throw new AuthError("User not found", {
                    cause: 404
                });
                // Check if user's account is locked
                const isUserLocked = await pool.query(`
                    SELECT next_attempt_allowed_at 
                    FROM scheduler_login_attempts
                    WHERE email = $1
                    AND next_attempt_allowed_at > NOW();
                `, [user.rows[0].email]);
                // User's account is locked
                if (isUserLocked.rowCount) throw new AuthError("Account currently locked", { cause: { next_attempt: isUserLocked.rows[0].next_attempt_allowed_at }});
                if (user.rows[0].password === null) {
                    // If decrypted password is null check if user is registered with a provider
                    const userProvider = await pool.query(`
                        SELECT provider FROM scheduler_users_providers
                        WHERE email = $1;
                    `, [user.rows[0].email]);
                    if (!userProvider.rows.length) throw new AuthError("Bad registry", {
                        cause: 409
                    });
                }
                // If it is not null, verify the hashed decrypted password
                const userKey = await pool.query(`
                    SELECT user_password_key FROM scheduler_users
                    WHERE email = $1 OR username = $1;
                `, [username]);
                if (userKey.rowCount === 0) {
                    throw new AuthError("Bad registry", {
                        cause: 409
                    })
                }
                const key = await decryptKmsDataKey(userKey.rows[0].user_password_key);
                if (key === null) throw new AuthError("Internal Error", { cause: 500 });

                const decryptedPassword = await pool.query(`
                    SELECT pgp_sym_decrypt_bytea(password, $2) AS decrypted_password
                    FROM scheduler_users
                    WHERE email = $1 OR username = $1;
                `, [username, key])
                if (decryptedPassword.rowCount === 0) throw new AuthError("Internal Error", { cause: 500 });
                
                const argon2id = new Argon2id();
                const verification = await argon2id.verify(decryptedPassword.rows[0].decrypted_password.toString(), password);

                if (!verification) { 
                    // If verification fails, insert registry to login_attempts
                    const attempt = await pool.query(`
                        INSERT INTO scheduler_login_attempts (email, created_at, last_attempt_at, next_attempt_allowed_at, attempts)
                        VALUES ($1, NOW(), NOW(), NOW() + INTERVAL '1 minute', 1)
                        ON CONFLICT (email) 
                        DO UPDATE SET 
                            last_attempt_at = NOW(),
                            next_attempt_allowed_at = NOW() + (scheduler_login_attempts.attempts * INTERVAL '1 minute'),
                            attempts = scheduler_login_attempts.attempts + 1
                        RETURNING next_attempt_allowed_at;
                    `, [user.rows[0].email]);
                    throw new AuthError("Invalid credentials", {
                        cause: {
                            next_attempt: attempt.rows[0].next_attempt_allowed_at
                        }
                    })
                }
                await pool.query(`
                    DELETE FROM scheduler_login_attempts WHERE email = $1;
                `, [user.rows[0].email]);
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