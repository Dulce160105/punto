import { createLovableAuth, type OAuthProvider } from "@lovable.dev/cloud-auth-js";
import { supabase } from "@/integrations/supabase/client";
const auth = createLovableAuth({ oauthBrokerUrl: "https://screenshot-replica-champ.lovable.app/~oauth/initiate" });
export const lovable = { auth: {
  async signInWithOAuth(provider: OAuthProvider, options?: { redirect_uri?: string; extraParams?: Record<string, string> }) {
    const result = await auth.signInWithOAuth(provider, options);
    if (!result.error && !result.redirected) {
      const { error } = await supabase.auth.setSession(result.tokens);
      if (error) return { error };
    }
    return result;
  },
} };
