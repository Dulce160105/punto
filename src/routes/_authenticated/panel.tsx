import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { CARD_TEMPLATES, LoyaltyCardPreview } from "@/components/loyalty-card-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBusiness } from "@/hooks/use-app-data";
import { useSession } from "@/hooks/use-session";
import { CustomerList } from "@/components/customer-list";
import { BusinessQrCodes } from "@/components/business-qr-codes";
import { useCardDesigns } from "@/hooks/use-card-designs";
import { BusinessLogoUpload } from "@/components/business-logo-upload";

export const Route = createFileRoute("/_authenticated/panel")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Mi empresa — Punto" },
      {
        name: "description",
        content: "Configura los datos de tu empresa y el diseño de tu tarjeta de lealtad.",
      },
      { property: "og:title", content: "Mi empresa — Punto" },
      { property: "og:description", content: "Panel de tu programa de lealtad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Panel,
});

const ACCENTS = ["#00B4D8", "#48CAE4", "#90E0EF", "#F4A261", "#E76F51", "#A78BFA"];

type FormState = {
  commercial_name: string;
  legal_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo_url: string;
  card_template: string;
  points_style: string;
  points_required: number;
  accent_color: string;
  reward_description: string;
  logo_position: string;
  logo_size: string;
};

const EMPTY: FormState = {
  commercial_name: "",
  legal_name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  logo_url: "",
  card_template: "aurora",
  points_style: "circles",
  points_required: 10,
  accent_color: "#00B4D8",
  reward_description: "",
  logo_position: "top-left",
  logo_size: "medium",
};

function Panel() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { data: business, isLoading } = useMyBusiness(user?.id);
  const designs = useCardDesigns();
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!business) return;
    setForm({
      commercial_name: business.commercial_name ?? "",
      legal_name: business.legal_name ?? "",
      email: business.email ?? "",
      phone: business.phone ?? "",
      address: business.address ?? "",
      website: business.website ?? "",
      logo_url: business.logo_url ?? "",
      card_template: business.card_template ?? "aurora",
      points_style: business.points_style ?? "circles",
      points_required: business.points_required ?? 10,
      accent_color: business.accent_color ?? "#00B4D8",
      reward_description: business.reward_description ?? "",
      logo_position: business.logo_position ?? "top-left",
      logo_size: business.logo_size ?? "medium",
    });
  }, [business]);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sesión no disponible");
      if (!form.commercial_name.trim()) throw new Error("El nombre comercial es obligatorio");
      if (!/^#[0-9a-fA-F]{6}$/.test(form.accent_color)) throw new Error("El color debe tener formato #00B4D8");
      const payload = { ...form, owner_id: user.id, updated_at: new Date().toISOString() };
      if (business) {
        const { error } = await supabase.from("businesses").update(payload).eq("id", business.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("businesses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Datos guardados");
      queryClient.invalidateQueries({ queryKey: ["my_business"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <AppShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Centro de lealtad</p>
          <h1 className="truncate text-3xl font-bold">Mi empresa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Estos datos aparecen en la tarjeta digital de tus clientes.
          </p>
        </div>
        {business ? (
          <span className="points-pill shrink-0">
            Estado: {business.status === "approved" ? "aprobada" : "pendiente de aprobación"}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <section className="surface-panel space-y-5 p-5 sm:p-7">
            <div><p className="eyebrow">Configuración</p><h2 className="text-xl font-bold">Datos del negocio</h2></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre comercial">
                <Input
                  value={form.commercial_name}
                  onChange={(event) => set("commercial_name", event.target.value)}
                  placeholder="Café Aurora"
                />
              </Field>
              <Field label="Razón social">
                <Input
                  value={form.legal_name}
                  onChange={(event) => set("legal_name", event.target.value)}
                />
              </Field>
              <Field label="Correo corporativo">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => set("email", event.target.value)}
                />
              </Field>
              <Field label="Teléfono">
                <Input
                  value={form.phone}
                  onChange={(event) => set("phone", event.target.value)}
                />
              </Field>
              <Field label="Dirección">
                <Input
                  value={form.address}
                  onChange={(event) => set("address", event.target.value)}
                />
              </Field>
              <Field label="Sitio web">
                <Input
                  value={form.website}
                  onChange={(event) => set("website", event.target.value)}
                  placeholder="https://"
                />
              </Field>
              <Field label="Logotipo del negocio">
                <BusinessLogoUpload {...(business ? { businessId: business.id } : {})} logoUrl={form.logo_url} onUploaded={(url) => set("logo_url", url)} />
              </Field>
              <Field label="Puntos para el premio">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={form.points_required}
                  onChange={(event) => set("points_required", Number(event.target.value))}
                />
              </Field>
            </div>

            <Field label="Premio al completar la tarjeta">
              <Textarea
                rows={3}
                value={form.reward_description}
                onChange={(event) => set("reward_description", event.target.value)}
                placeholder="Ej: al completar 10 puntos, un café gratis."
              />
            </Field>

            <div className="space-y-3">
              <Label>Diseño de la tarjeta</Label>
              <div className="flex flex-wrap gap-2">
                {CARD_TEMPLATES.map((template) => (
                  <Button
                    key={template.id}
                    type="button"
                    size="sm"
                    variant={form.card_template === template.id ? "default" : "outline"}
                    onClick={() => set("card_template", template.id)}
                  >
                    {template.label}
                  </Button>
                ))}
              </div>
              {(designs.data ?? []).length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(designs.data ?? []).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      title={d.name}
                      onClick={() => set("card_template", d.image_url)}
                      className={`overflow-hidden rounded-lg border-2 transition ${
                        form.card_template === d.image_url ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img referrerPolicy="no-referrer" src={d.image_url} alt={d.name} className="aspect-[1.6] w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label>Estilo de los puntos</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={form.points_style === "circles" ? "default" : "outline"}
                  onClick={() => set("points_style", "circles")}
                >
                  Círculos
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={form.points_style === "numeric" ? "default" : "outline"}
                  onClick={() => set("points_style", "numeric")}
                >
                  Numérico
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Color de acento</Label>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <input
                  type="color"
                  value={form.accent_color}
                  aria-label="Elegir cualquier color para los puntos"
                  onChange={(event) => set("accent_color", event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background p-1"
                />
                <Input value={form.accent_color} maxLength={7} onChange={(event) => set("accent_color", event.target.value)} aria-label="Código del color de puntos" />
              </div>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Color ${color}`}
                    onClick={() => set("accent_color", color)}
                    className={`h-9 w-9 rounded-full border transition-transform ${
                      form.accent_color === color ? "scale-110 border-primary" : "border-border"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={save.isPending}
              onClick={() => save.mutate()}
            >
              {save.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar cambios
            </Button>
          </section>

          <section className="surface-panel h-fit space-y-4 p-5 sm:p-7 lg:sticky lg:top-24">
            <div><p className="eyebrow">En tiempo real</p><h2 className="text-xl font-bold">Vista previa</h2></div>
            <LoyaltyCardPreview
              businessName={form.commercial_name}
              logoUrl={form.logo_url || null}
              template={form.card_template}
              pointsStyle={form.points_style}
              pointsRequired={form.points_required}
              points={Math.min(3, form.points_required)}
              accentColor={form.accent_color}
              rewardDescription={form.reward_description}
              logoPosition={form.logo_position}
              logoSize={form.logo_size}
            />
            <p className="text-xs text-muted-foreground">
              Tus códigos QR y la lista de clientes están más abajo.
            </p>
          </section>
        </div>
      )}
      {business ? (
        <BusinessQrCodes businessId={business.id} scanCode={business.scan_code} approved={business.status === "approved"} />
      ) : null}
      {business ? (
        <CustomerList businessId={business.id} pointsRequired={business.points_required} />
      ) : null}
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
