import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { allCards, saveCard } from "@/lib/card-storage";

export const Route = createFileRoute("/sumar/$scanCode")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Sumar punto — Punto" },
      { name: "description", content: "Suma un punto a tu tarjeta de lealtad." },
      { property: "og:title", content: "Sumar punto — Punto" },
      { property: "og:description", content: "Suma un punto a tu tarjeta de lealtad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AddPoint,
});

type Result = {
  status: "ok" | "locked" | "no_card" | "invalid_business";
  points?: number;
  required?: number;
  reward_ready?: boolean;
  next_at?: string;
  business_id?: string;
  cardId?: string;
};

function AddPoint() {
  const { scanCode } = Route.useParams();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    (async () => {
      const ids = allCards();
      let last: Result = { status: "no_card" };
      for (const id of ids) {
        const { data, error } = await supabase.rpc("add_loyalty_point", { _scan_code: scanCode, _card_id: id });
        if (error) continue;
        const r = data as unknown as Result;
        last = { ...r, cardId: id };
        if (r.status !== "no_card") break;
      }
      if (ids.length === 0) {
        const { data } = await supabase.rpc("add_loyalty_point", {
          _scan_code: scanCode,
          _card_id: "00000000-0000-0000-0000-000000000000",
        });
        last = (data as unknown as Result) ?? last;
      }
      if (last.cardId && last.business_id) saveCard(last.business_id, last.cardId);
      setResult(last);
    })();
  }, [scanCode]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6">
      <section className="glass-panel w-full max-w-sm space-y-4 p-5 text-center sm:p-8">
        {!result ? (
          <><Loader2 className="mx-auto h-8 w-8 animate-spin" /><p>Buscando tu tarjeta…</p></>
        ) : result.status === "ok" ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-xl font-semibold">¡Punto sumado!</h1>
            <p>Llevas {result.points} de {result.required} puntos.</p>
            {result.reward_ready ? <p className="font-medium text-primary">¡Ganaste tu premio! Muéstralo en caja.</p> : null}
          </>
        ) : result.status === "locked" ? (
          <>
            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Ya sumaste hoy</h1>
            <p className="text-muted-foreground">
              Podrás sumar otro punto el {new Date(result.next_at!).toLocaleString("es-GT")}.
            </p>
          </>
        ) : result.status === "no_card" && result.business_id ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="text-xl font-semibold">No encontramos tu tarjeta</h1>
            <p className="text-muted-foreground">Crea tu tarjeta en este teléfono para empezar a sumar.</p>
            <Button asChild className="w-full">
              <Link to="/unirse/$businessId" params={{ businessId: result.business_id }}>Crear mi tarjeta</Link>
            </Button>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="text-xl font-semibold">Código no válido</h1>
            <p className="text-muted-foreground">Este código no pertenece a un negocio activo.</p>
          </>
        )}
        {result?.cardId && result.status !== "no_card" ? (
          <Button asChild variant="outline" className="w-full">
            <Link to="/tarjeta/$cardId" params={{ cardId: result.cardId }}>Ver mi tarjeta</Link>
          </Button>
        ) : null}
      </section>
    </main>
  );
}
