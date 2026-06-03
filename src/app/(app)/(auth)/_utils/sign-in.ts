import { createClient } from "@/lib/supabase/client"

const supabase = createClient();

// ---cut---
export default async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}