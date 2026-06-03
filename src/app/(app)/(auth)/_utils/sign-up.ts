import { createClient } from "@/lib/supabase/client"

const supabase = createClient();

// ---cut---
export default async function signUpNewUser(email: string, password: string, emailRedirectTo: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });
  return { data, error };
}