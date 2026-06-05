import { createClient } from "@/lib/supabase/client";
import isPasswordLeaked from "./is-password-leaked";
import { AuthError } from "@supabase/supabase-js";

const supabase = createClient();
export default async function updatePassword(password: string, current_password: string) {
    const passwordLeaked = await isPasswordLeaked(password);
    if (passwordLeaked) {
    return {
        data: {
        user: null,
        session: null,
        },
        error: new AuthError("The password is flagged as leaked"),
    }
    } else if (passwordLeaked === null) {
    return {
        data: {
        user: null,
        session: null,
        },
        error: new AuthError("An error occurred when checking data breaches"),
    }
    }
    const { data, error } = await supabase.auth.updateUser({
        password,
        current_password,
    });
    return { data, error };
}