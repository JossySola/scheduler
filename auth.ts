import "server-only";
import NextAuth from "next-auth";
import { AuthError } from "@auth/core/errors";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { sql } from "@vercel/postgres";
import type {
  Account,
  Profile,
  Session,
  User,
} from "@auth/core/types";
import { getUserByEmail } from "./app/lib/auth/getUserByEmail";
import { getUserIntelByUsername } from "./app/lib/auth/getUserIntelByUsername";
import { isAccountLocked } from "./app/lib/auth/isAccountLocked";
import { isUserSignedInWithProvider } from "./app/lib/auth/isUserSignedInWithProvider";
import { getPasswordKey } from "./app/lib/auth/getPasswordKey";
import { getDecryptedKey } from "./app/lib/auth/getDecryptedKey";
import { getDecryptedPassword } from "./app/lib/auth/getDecryptedPassword";
import { verifyPassword } from "./app/lib/auth/verifyPassword";
import { setFailedAttemptRecord } from "./app/lib/auth/setFailedAttemptRecord";
import { getProviderNameConfirmation } from "./app/lib/auth/getProviderNameConfirmation";
import { setNewUser } from "./app/lib/auth/setNewUser";
import { setUserWithProvider } from "./app/lib/auth/setUserWithProvider";
import { defaultLocale } from "./app/lib/config/i18n";

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
                if (!profile.email) {
                    throw new Error("Facebook profile is missing email");
                }
                // Check if user exists
                const id = await getUserByEmail(profile.email);
                if (id) {
                    // If user exists, set the id to the stored id
                    profile.id = id;
                }
                profile.image = profile.picture;
                return { ... profile };
            }
        }),
        Facebook({
            authorization: {
                params: {
                    response_type: "code",
                },
            },
            async profile(profile) {
                if (!profile.email) {
                    throw new Error("Facebook profile is missing email");
                }
                // Check if user exists in scheduler_users
                const id = await getUserByEmail(profile.email);
                if (id) {
                    // If user exists, set the id to the stored id
                    profile.id = id;
                }
                profile.image = profile.picture.data.url;
                return { ... profile };
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

                // If data is missing or the data type is inccorect, throw an error
                if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
                    throw new Error("Data missing or data type incorrect", { cause: 400 });
                }
                // Gather data if user exists
                const userData = await getUserIntelByUsername(username);
                // User not found
                if (!userData) {
                    throw new AuthError("User not found", {
                        cause: 404
                    });
                }
                // Check if user's account is locked
                const account = await isAccountLocked(userData.email);
                // User's account is locked
                if (account.isLocked) {
                    const next_attempt = account.nextAttempt;
                    throw new AuthError("Account currently locked", { cause: { next_attempt } });
                }
                // If the user was found but the password is null, it means that the user signed in with either Google or Facebook
                if (userData.password === null) {
                    // Check if the user has a record on scheduler_users_providers to determine if the user signed in with an external provider or if it is an incorrect registry
                    const signedWithProvider = await isUserSignedInWithProvider(userData.email);
                    if (!signedWithProvider) {
                        // If the user's password is NULL and it hasn't signed in with a provider, then the registration is incorrect.
                        throw new AuthError("Bad registry", {
                            cause: 409
                        });
                    } else {
                        // The user's password is null because it has signed in with an external provider, so we throw a different error message to inform the user.
                        throw new AuthError("User does not have credentials but have signed in with external provider", { cause: 402 });
                    }
                }
                // If it is not null, first get the password KMS key
                const passwordKey = await getPasswordKey(username);
                if (passwordKey === null) {
                    throw new AuthError("Bad registry", {
                        cause: 409
                    });
                }
                // Decrypt the KMS key
                const key = await getDecryptedKey(passwordKey);
                if (!key) {
                    throw new AuthError("Null KMS", { cause: 500 })
                }
                // Decrypt the password using the decrypted KMS key
                const decryptedPassword = await getDecryptedPassword(key, userData.email);
                if (decryptedPassword === null) {
                    throw new AuthError("Internal Error", { cause: 500 });
                }
                // Verify the password by sending the input password and the decrypted hashed password to the API route that handles verification
                const passwordIsValid = await verifyPassword(password, decryptedPassword);
                if (!passwordIsValid) { 
                    // If verification fails, insert record to login_attempts
                    const next_attempt = await setFailedAttemptRecord(userData.email);
                    throw new AuthError("Invalid credentials", { cause: { next_attempt } })
                }
                // If the password is correct, delete any record of failed attempts for that user
                await sql`
                    DELETE FROM scheduler_login_attempts WHERE email = ${userData.email};
                `;
                return {
                    id: userData.id,
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    image: userData.user_image,
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: User, account: Account }) {
            try {
                switch(account.provider) {
                    case "facebook": {
                        if (user && user.email && user.name && user.image) {
                            const provider = await getProviderNameConfirmation(user.email, "facebook");
                            if (provider === "facebook") {
                                // If the user has already signed in with Facebook before
                                return true;
                            }
                            // Check if user already exists on scheduler_users
                            const userExists = await getUserByEmail(user.email);
                            if (!userExists) {
                                // Create a new user record on scheduler_users if it doesn't exist
                                const newUser = await setNewUser(user.name, user.name, user.email, user.image);
                                if (!newUser.success) {
                                    return false;
                                }
                                account.providerAccountId = newUser.id;
                                user.id = newUser.id;
                            }
                            // Add record to scheduler_users_providers
                            const newProviderRecord = await setUserWithProvider(user.email, account.provider, account.providerAccountId);
                            if (!newProviderRecord.success) {
                                return false;
                            }
                            return true;
                        }
                        return false;
                    };
                    case "google": {
                        if (user && user.email && user.name && user.image) {
                            const provider = await getProviderNameConfirmation(user.email, "google");
                            if (provider === "google") {
                                // If the user has already signed in with Google before
                                return true;
                            }
                            // Check if user already exists on scheduler_users
                            const userExists = await getUserByEmail(user.email);
                            if (!userExists) {
                                // Create a new user record on scheduler_users if it doesn't exist
                                const newUser = await setNewUser(user.name, user.name, user.email, user.image);
                                if (!newUser.success) {
                                    return false;
                                }
                                account.providerAccountId = newUser.id;
                                user.id = newUser.id;
                            }
                            // Add record to scheduler_users_providers
                            const newProviderRecord = await setUserWithProvider(user.email, account.provider, account.providerAccountId);
                            if (!newProviderRecord.success) {
                                return false;
                            }
                            return true;
                        }
                        return false;
                    };
                    default: {
                        return true;
                    };
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
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
            } else if (token.id) {
                session.user.id = token.id;
            }
            return session;
        },
        async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
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
});