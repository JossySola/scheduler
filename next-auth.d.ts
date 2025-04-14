import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: string;
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