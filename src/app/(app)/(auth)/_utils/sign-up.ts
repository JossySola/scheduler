import { createClient } from "@/lib/supabase/client"
import isPasswordLeaked from "./is-password-leaked";
import { AuthError } from "@supabase/supabase-js";

const supabase = createClient();

// ---cut---
export default async function signUpNewUser(email: string, password: string, emailRedirectTo: string) {
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });
  return { data, error };
}