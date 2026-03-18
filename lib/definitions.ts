export type SignUpEmailData = {
    token: null;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        username?: string | null | undefined;
        displayUsername?: string | null | undefined; 
    }
} | {
    token: string;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        username?: string | null | undefined;
        displayUsername?: string | null | undefined; 
    };
}
export type SignInUsernameData = {
    token: string;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    } & {
        username: string;
        displayUsername: string;
    };
}