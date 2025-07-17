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
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { KMSDataKey } from "./app/lib/definitions";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";

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
                const stored_id = await sql`
                SELECT scheduler_users.id
                FROM scheduler_users 
                JOIN scheduler_users_providers
                    ON scheduler_users.email = scheduler_users_providers.email
                    AND scheduler_users_providers.provider = 'google'
                WHERE scheduler_users.email = ${profile.email};
                `.then(response => response.rowCount !== 0 ? response.rows[0].id : null);
                if (stored_id) {
                    profile.id = stored_id;
                }
                profile.image = profile.picture;
                return { ... profile }
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
                const stored_id = await sql`
                SELECT scheduler_users.id
                FROM scheduler_users 
                JOIN scheduler_users_providers
                    ON scheduler_users.email = scheduler_users_providers.email
                    AND scheduler_users_providers.provider = 'facebook'
                WHERE scheduler_users.email = ${profile.email};
                `.then(response => response.rowCount !== 0 ? response.rows[0].id : null);
                if (stored_id) {
                    profile.id = stored_id;
                }
                profile.image = profile.picture.data.url;
                return { ... profile }
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
                const verifyReq = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/argon2/verify`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        hashed: decrypted,
                        password
                    })
                });
                if (!verifyReq.ok || verifyReq.status !== 200) {
                    throw new AuthError("Failed verification", { cause: 500 });
                }
                const res = await verifyReq.json();
                const isValid: boolean = res.isValid;
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
        async signIn({ user, account }: { user: User, account: Account }) {
            try {
                switch(account.provider) {
                    case "facebook": {
                        const user_provider = await sql`
                            SELECT provider
                            FROM scheduler_users_providers
                            WHERE email = ${user.email} AND provider = 'facebook';
                        `.then(response => response.rowCount !== 0 ? response.rows[0].provider : null);
                        if (user_provider !== null && user_provider === "facebook") {
                            // If the user has already signed in with Facebook before
                            return true;
                        }
                        // Add record to scheduler_users_providers
                        const new_key = await generateKmsDataKey();
                        const insertToProviders = await sql`
                        INSERT INTO scheduler_users_providers (email, provider, account_id, account_id_key)
                        VALUES (${user.email}, ${account.provider}, pgp_sym_encrypt(${account.providerAccountId}, ${new_key.Plaintext}), ${new_key.CiphertextBlob});
                        `.then(response => response.rowCount !== 0 ? true : false);
                        if (!insertToProviders) {
                            return false;
                        }
                        // Check if user already exists on scheduler_users
                        const user_record = await sql`
                        SELECT id FROM scheduler_users WHERE email = ${user.email};
                        `.then(response => response.rowCount !== 0 ? true : false);
                        if (user_record) {
                            return true;
                        }
                        // Create a new user record on scheduler_users if it doesn't exist
                        const new_record = await sql`
                        INSERT INTO scheduler_users(name, username, email, user_image)
                        VALUES (
                            ${user.name},
                            ${user.name},
                            ${user.email},
                            ${user.image}
                        )
                        ON CONFLICT (username) DO NOTHING;
                        `.then(response => response.rowCount !== 0 ? true : false);
                        if (!new_record) {
                            return false;
                        }
                        return true;
                    };
                    case "google": {
                        const user_provider = await sql`
                            SELECT provider
                            FROM scheduler_users_providers
                            WHERE email = ${user.email} AND provider = 'google';
                        `.then(response => response.rowCount !== 0 ? response.rows[0].provider : null);
                        if (user_provider !== null) {
                            // If the user has already signed in with Facebook before
                            return true;
                        }
                        // Add record to scheduler_users_providers
                        const new_key = await generateKmsDataKey();
                        const insertToProviders = await sql`
                        INSERT INTO scheduler_users_providers (email, provider, account_id, account_id_key)
                        VALUES (${user.email}, ${account.provider}, pgp_sym_encrypt(${account.providerAccountId}, ${new_key.Plaintext}), ${new_key.CiphertextBlob});
                        `.then(response => response.rowCount !== 0 ? true : false);
                        if (!insertToProviders) {
                            return false;
                        }
                        // Check if user already exists on scheduler_users
                        const user_record = await sql`
                        SELECT id FROM scheduler_users WHERE email = ${user.email};
                        `.then(response => response.rowCount !== 0 ? true : false);
                        if (user_record) {
                            return true;
                        }
                        // Create a new user record on scheduler_users if it doesn't exist
                        const new_record = await sql`
                        INSERT INTO scheduler_users(name, username, email, user_image)
                        VALUES (
                            ${user.name},
                            ${user.name},
                            ${user.email},
                            ${user.picture}
                        )
                        ON CONFLICT (username) DO NOTHING;
                        `.then(response => response.rowCount !== 0 ? true : false);
                        if (!new_record) {
                            return false;
                        }
                        return true;
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

async function generateKmsDataKey (): Promise<KMSDataKey> {
  const accessKeyId = process.env.AWS_KMS_KEY;
  const secretAccessKey = process.env.AWS_KMS_SECRET;
  const region = 'us-east-1';
  const service = 'kms';
  try {
    if (!accessKeyId || !secretAccessKey) throw new Error("Missing keys", { cause: 400 });
    const signer = new SignatureV4({
      credentials: { accessKeyId, secretAccessKey },
      service,
      region,
      sha256: Sha256
    });
    const signedRequest = await signer.sign({
      method: "POST",
      hostname: "kms.us-east-1.amazonaws.com",
      protocol: "https:",
      port: 443,
      path: "/",
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'TrentService.GenerateDataKey',
        'Host': "kms.us-east-1.amazonaws.com",
      },
      body: JSON.stringify({
        "KeyId": "alias/scheduler",
        "KeySpec": "AES_256"
      })
    })
    const response = await fetch("https://kms.us-east-1.amazonaws.com", {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body
    });
    if (!response) throw new Error("No response", { cause: 500 })
    if (!response.ok) {
      const errorText = await response.text(); // Get AWS error message
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }
    const data: KMSDataKey = await response.json();
    if (data.CiphertextBlob && data.Plaintext) {
      return data;
    } else {
      throw new Error("Invalid response", { cause: 400 });
    }
  } catch (e) {
    throw e;
  }
}