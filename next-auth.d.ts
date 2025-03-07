import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        googleAccessToken?: string;
        facebookAccessToken?: string;
        googleSub?: string;
        facebookSub?: string;
        username?: string;
    }
    interface User extends DefaultUser {
        googleSub?: string;
        facebookSub?: string;
        username?: string;
        image?: string;
        id?: string;
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