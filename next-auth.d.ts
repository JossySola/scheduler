import type { DefaultUser, DefaultJWT, DefaultSession } from "@auth/core/types";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: string;
            picture?: string;
        } & DefaultSession["user"];
        googleAccessToken?: string;
        facebookAccessToken?: string;
        googleSub?: string;
        facebookSub?: string;
        username?: string;
    }
    interface User extends DefaultUser {
        id: string;
        googleSub?: string;
        facebookSub?: string;
        username?: string;
        image?: string;
        role?: string;
        picture?: string;
    }
}
declare module "@auth/core/types" {
    interface User extends DefaultUser {
        username?: string;
        name?: string | undefined;
        email?: string | undefined;
        googleSub?: string | undefined;
        facebookSub?: string | undefined;
        picture?: string;
    }
    interface Session extends DefaultSession {
        googleAccessToken?: string | undefined;
        facebookAccessToken?: string | undefined;
    }
}
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        googleAccessToken?: string;
        facebookAccessToken?: string;
        googleSub?: string;
        facebookSub?: string;
        username?: string;
        image?: string;
        id?: string;
    }
}