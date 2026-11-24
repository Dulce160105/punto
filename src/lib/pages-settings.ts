import { supabase } from "@/integrations/supabase/client";
export async function getSiteVerification(): Promise<string | null> {
  const { data, error } = await supabase.from("app_settings").select("value").eq("key", "google_site_verification").maybeSingle();
  return error ? null : data?.value?.trim() || null;
}
