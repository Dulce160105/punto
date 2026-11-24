import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/lib/pages-auth";
import { LoyaltyCardPreview } from "@/components/loyalty-card-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCard, saveCard } from "@/lib/card-storage";
import { useSession } from "@/hooks/use-session";
import { openBusinessContact } from "@/lib/vcard";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/unirse/$businessId")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Obtén tu tarjeta de lealtad — Punto" },
      { name: "description", content: "Crea tu tarjeta digital y empieza a sumar puntos." },
      { property: "og:title", content: "Obtén tu tarjeta de lealtad — Punto" },
      { property: "og:description", content: "Crea tu tarjeta digital y empieza a sumar puntos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Join,
});

const PENDING_KEY = "punto_join_pending";

function Join() {
  const { businessId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [manual, setManual] = useState(false);
  const [oauthPending, setOauthPending] = useState<string | null>(null);
  const [contactAccepted, setContactAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    const existing = getCard(businessId);
    if (existing) navigate({ to: "/tarjeta/$cardId", params: { cardId: existing }, replace: true });
  }, [businessId, navigate]);

  const { data: business, isLoading } = useQuery({
    queryKey: ["join", businessId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("join_business_info_v2", { _business_id: businessId });
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  const create = useMutation({
    mutationFn: async (input: { name: string; email: string; phone: string }) => {
      if (!privacyAccepted && sessionStorage.getItem(`${PENDING_KEY}_consent`) !== businessId) throw new Error("Acepta las condiciones y privacidad");
      if (input.name.trim().length < 2) throw new Error("Escribe tu nombre");
      if (!input.email.trim() && !input.phone.trim()) throw new Error("Agrega tu correo o teléfono");
      const { data, error } = await supabase.rpc("create_loyalty_card_v2", {
        _business_id: businessId,
        _name: input.name,
        _email: input.email,
        _phone: input.phone,
        _accepted: true,
      });
      if (error) throw error;
      return data as string;
    },
    onSuccess: async (cardId) => {
      saveCard(businessId, cardId);
      sessionStorage.removeItem(`${PENDING_KEY}_consent`);
      if (sessionStorage.getItem(PENDING_KEY)) {
        sessionStorage.removeItem(PENDING_KEY);
        await supabase.auth.signOut();
      }
      navigate({ to: "/tarjeta/$cardId", params: { cardId } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Al volver de Google/Apple: crear la tarjeta con sus datos automáticamente
  useEffect(() => {
    if (!user || !business || create.isPending || create.isSuccess) return;
    if (sessionStorage.getItem(PENDING_KEY) !== businessId) return;
    const meta = user.user_metadata ?? {};
    const fullName = (meta["full_name"] || meta["name"] || user.email?.split("@")[0] || "Cliente") as string;
    create.mutate({ name: fullName, email: user.email ?? "", phone: user.phone ?? "" });
  }, [user, business, businessId, create]);

  async function connect(provider: "google" | "apple") {
    if (!business || !privacyAccepted) {
      toast.error("Acepta las condiciones y privacidad para continuar");
      return;
    }
    if (contactAccepted) openBusinessContact(business);
    setOauthPending(provider);
    sessionStorage.setItem(PENDING_KEY, businessId);
    sessionStorage.setItem(`${PENDING_KEY}_consent`, businessId);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.href,
    });
    if (result.error) {
      setOauthPending(null);
      sessionStorage.removeItem(PENDING_KEY);
      sessionStorage.removeItem(`${PENDING_KEY}_consent`);
      toast.error("No pudimos obtener tus datos. Intenta de nuevo.");
    }
  }

  if (isLoading) return <Center><Loader2 className="h-6 w-6 animate-spin" /></Center>;
  if (!business)
    return <Center><p className="text-muted-foreground">Esta empresa no está disponible.</p></Center>;
  if (create.isPending || (user && sessionStorage.getItem(PENDING_KEY)))
    return (
      <Center>
        <div className="space-y-3">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <p className="text-muted-foreground">Creando tu tarjeta…</p>
        </div>
      </Center>
    );

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Tu tarjeta de {business.commercial_name}</h1>
      <LoyaltyCardPreview
        businessName={business.commercial_name}
        logoUrl={business.logo_url}
        template={business.card_template}
        pointsStyle={business.points_style}
        pointsRequired={business.points_required}
        accentColor={business.accent_color}
        rewardDescription={business.reward_description}
        customerName={name || "Tu nombre"}
        logoPosition={business.logo_position}
        logoSize={business.logo_size}
      />
      <section className="glass-panel space-y-4 p-6">
        <p className="text-sm text-muted-foreground">
          Toca un botón y acepta compartir tu nombre y correo. No tienes que escribir nada.
        </p>
        <label className="glass-soft flex cursor-pointer items-start gap-3 p-3 text-sm">
          <Checkbox checked={privacyAccepted} onCheckedChange={value => setPrivacyAccepted(value === true)} className="mt-0.5" />
          <span>Acepto las <Link to="/terminos" className="text-primary underline">condiciones de uso</Link> y la <Link to="/privacidad" className="text-primary underline">privacidad</Link>, y compartir mi nombre y contacto con {business.commercial_name} para gestionar esta tarjeta, no para publicidad.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm"><Checkbox checked={contactAccepted} onCheckedChange={value => setContactAccepted(value === true)} className="mt-0.5" /><span>También quiero guardar el contacto de {business.commercial_name} (opcional).</span></label>
        <p className="text-xs text-muted-foreground">Tu teléfono mostrará la confirmación final antes de guardarlo.</p>
        <Button className="w-full" size="lg" disabled={oauthPending !== null || !privacyAccepted} onClick={() => connect("google")}>
          {oauthPending === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Crear tarjeta con Google
        </Button>
        <Button className="w-full" size="lg" variant="outline" disabled={oauthPending !== null || !privacyAccepted} onClick={() => connect("apple")}>
          {oauthPending === "apple" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Crear tarjeta con Apple
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Al continuar aceptas los{" "}
          <Link to="/terminos" className="text-primary underline-offset-4 hover:underline">términos y condiciones</Link>.
        </p>
        {!manual ? (
          <button type="button" className="w-full text-center text-xs text-muted-foreground underline" onClick={() => setManual(true)}>
            Prefiero escribir mis datos
          </button>
        ) : (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} maxLength={100} autoComplete="name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Correo</Label>
              <Input type="email" value={email} maxLength={255} autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input type="tel" value={phone} maxLength={30} autoComplete="tel" onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button className="w-full" variant="outline" disabled={create.isPending || !privacyAccepted} onClick={() => {
              if (contactAccepted) openBusinessContact(business);
              create.mutate({ name, email, phone });
            }}>
              Crear mi tarjeta
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-4 text-center">{children}</main>;
}
