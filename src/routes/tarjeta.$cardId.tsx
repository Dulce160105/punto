import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoyaltyCardPreview } from "@/components/loyalty-card-preview";
import { Button } from "@/components/ui/button";
import { saveCard } from "@/lib/card-storage";
import { CustomerMascot } from "@/components/customer-mascot";

export const Route = createFileRoute("/tarjeta/$cardId")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Mi tarjeta de lealtad — Punto" },
      { name: "description", content: "Tu tarjeta digital de puntos." },
      { property: "og:title", content: "Mi tarjeta de lealtad — Punto" },
      { property: "og:description", content: "Tu tarjeta digital de puntos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardPage,
});

function CardPage() {
  const { cardId } = Route.useParams();
  const { data: card, isLoading } = useQuery({
    queryKey: ["card", cardId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_loyalty_card_v2", { _card_id: cardId });
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  useEffect(() => {
    if (card) saveCard(card.business_id, card.id);
  }, [card]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "Mi tarjeta", url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    }
  }

  if (isLoading)
    return <main className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></main>;
  if (!card)
    return <main className="flex min-h-screen items-center justify-center px-4 text-muted-foreground">Tarjeta no encontrada.</main>;

  const full = card.points >= card.points_required;
  const locked = card.last_scan_at && new Date(card.last_scan_at).getTime() + 86400000 > Date.now();

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Hola, {card.customer_name}</h1>
      <div className="flex justify-center"><CustomerMascot seed={card.id} size="lg" active={full} /></div>
      <LoyaltyCardPreview
        businessName={card.commercial_name}
        logoUrl={card.logo_url}
        template={card.card_template}
        pointsStyle={card.points_style}
        pointsRequired={card.points_required}
        points={card.points}
        accentColor={card.accent_color}
        rewardDescription={card.reward_description}
        customerName={card.customer_name}
        logoPosition={card.logo_position}
        logoSize={card.logo_size}
      />
      <section className="glass-panel space-y-3 p-6 text-sm">
        {full ? (
          <p className="font-medium text-primary">¡Tarjeta completa! Muestra esta pantalla para reclamar tu premio.</p>
        ) : (
          <p>Tienes {card.points} de {card.points_required} puntos.</p>
        )}
        {locked ? (
          <p className="text-muted-foreground">
            Próximo punto disponible: {new Date(new Date(card.last_scan_at ?? "").getTime() + 86400000).toLocaleString("es-GT")}
          </p>
        ) : null}
        <p className="text-muted-foreground">
          Para sumar un punto, escanea el QR de puntos del negocio con la cámara de este mismo teléfono.
        </p>
        <p className="text-muted-foreground">
          Guarda esta tarjeta: en iPhone toca Compartir → "Agregar a inicio"; en Android, menú ⋮ → "Agregar a pantalla principal".
        </p>
        <Button variant="outline" className="w-full" onClick={share}>
          <Share2 className="mr-2 h-4 w-4" /> Compartir o copiar enlace
        </Button>
        <p className="text-xs text-muted-foreground">Este enlace permite ver tu nombre y puntos. Compártelo únicamente con personas de confianza.</p>
      </section>
    </main>
  );
}
