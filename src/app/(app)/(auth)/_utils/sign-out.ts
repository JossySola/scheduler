import { createClient } from "@/lib/supabase/client";

export default async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
}