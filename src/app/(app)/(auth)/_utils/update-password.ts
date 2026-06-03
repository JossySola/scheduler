import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
export default async function updatePassword(password: string, current_password: string) {
    const { data, error } = await supabase.auth.updateUser({
        password,
        current_password,
    });
    return { data, error };
}