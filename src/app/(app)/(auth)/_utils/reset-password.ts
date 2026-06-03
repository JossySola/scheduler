import { createClient } from "@/lib/supabase/client"

const supabase = createClient();
export default async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}