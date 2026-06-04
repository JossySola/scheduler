import { createClient } from "@/lib/supabase/client"

const supabase = createClient();
export default async function resetPassword(email: string, redirectTo: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { data, error };
}