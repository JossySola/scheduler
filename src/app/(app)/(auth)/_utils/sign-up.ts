import { createClient } from "@/lib/supabase/client"

const supabase = createClient();

// ---cut---
export default async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'valid.email@supabase.io',
    password: 'example-password',
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  });
  return { data, error };
}