import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCardDesigns() {
  return useQuery({
    queryKey: ["card_designs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("card_designs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
