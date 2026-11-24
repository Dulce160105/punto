import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAdmin, useSettings } from "@/hooks/use-app-data";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { formatDate } from "@/lib/format";
import { CardDesignsAdmin } from "@/components/card-designs-admin";
import { PlatformSettingsAdmin } from "@/components/platform-settings-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Administración — Punto" },
      {
        name: "description",
        content: "Panel de administración: empresas registradas, aprobaciones y métricas.",
      },
      { property: "og:title", content: "Administración — Punto" },
      { property: "og:description", content: "Métricas y aprobación de empresas en Punto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user } = useSession();
  const { data: isAdmin, isLoading: checkingRole } = useIsAdmin(user?.id);
  const queryClient = useQueryClient();

  const businesses = useQuery({
    queryKey: ["admin_businesses"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const cardsCount = useQuery({
    queryKey: ["admin_cards_count"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("loyalty_cards")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("businesses").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Empresa actualizada");
      queryClient.invalidateQueries({ queryKey: ["admin_businesses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeBusiness = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Empresa eliminada");
      queryClient.invalidateQueries({ queryKey: ["admin_businesses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const setLogoLayout = useMutation({
    mutationFn: async ({ id, logo_position, logo_size }: { id: string; logo_position: string; logo_size: string }) => {
      const { error } = await supabase.from("businesses").update({ logo_position, logo_size }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ubicación del logotipo actualizada");
      queryClient.invalidateQueries({ queryKey: ["admin_businesses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (checkingRole) {
    return (
      <AppShell>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="glass-panel mx-auto max-w-md p-7 text-center">
          <h1 className="text-xl font-semibold">Acceso restringido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta sección es solo para administradores de la plataforma.
          </p>
          <Button asChild className="mt-5">
            <Link to="/panel">Ir a mi empresa</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const list = businesses.data ?? [];
  const approved = list.filter((item) => item.status === "approved").length;
  const pending = list.filter((item) => item.status === "pending").length;

  return (
    <AppShell>
      <p className="eyebrow">Vista general</p>
      <h1 className="text-3xl font-bold">Administración</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Empresas registradas, aprobaciones y actividad general.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Metric label="Empresas" value={list.length} />
        <Metric label="Aprobadas" value={approved} />
        <Metric label="Pendientes" value={pending} />
        <Metric label="Tarjetas creadas" value={cardsCount.data ?? 0} />
      </div>

      <CardDesignsAdmin />
      <PlatformSettingsAdmin />

      <SiteVerificationSection />

      <section className="surface-panel mt-8 p-5 sm:p-7">
        <div><p className="eyebrow">Comunidad Punto</p><h2 className="text-xl font-bold">Empresas</h2></div>
        {businesses.isLoading ? (
          <Skeleton className="mt-4 h-32 w-full rounded-xl" />
        ) : list.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Todavía no hay empresas registradas.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {list.map((item) => (
              <li key={item.id} className="grid gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="font-medium">{item.commercial_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.email || "sin correo"} · registrada {formatDate(item.created_at)} ·{" "}
                    {item.points_required} puntos
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="text-xs text-muted-foreground">
                      Posición del logotipo
                      <Select
                        value={item.logo_position}
                        disabled={setLogoLayout.isPending}
                        onValueChange={(value) => setLogoLayout.mutate({ id: item.id, logo_position: value, logo_size: item.logo_size })}
                      >
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Arriba izquierda</SelectItem>
                          <SelectItem value="top-center">Arriba centro</SelectItem>
                          <SelectItem value="top-right">Arriba derecha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tamaño del logotipo
                      <Select
                        value={item.logo_size}
                        disabled={setLogoLayout.isPending}
                        onValueChange={(value) => setLogoLayout.mutate({ id: item.id, logo_position: item.logo_position, logo_size: value })}
                      >
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeño</SelectItem>
                          <SelectItem value="medium">Mediano</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <span className="glass-soft px-3 py-1 text-xs text-muted-foreground">
                    {item.status}
                  </span>
                  {item.status !== "approved" ? (
                    <Button
                      size="sm"
                      disabled={setStatus.isPending}
                      onClick={() => setStatus.mutate({ id: item.id, status: "approved" })}
                    >
                      Aprobar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={setStatus.isPending}
                      onClick={() => setStatus.mutate({ id: item.id, status: "suspended" })}
                    >
                      Suspender
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={removeBusiness.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Eliminar "${item.commercial_name}"? Se borrarán también sus tarjetas y puntos. Esta acción no se puede deshacer.`,
                        )
                      ) {
                        removeBusiness.mutate(item.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}

function SiteVerificationSection() {
  const settings = useSettings();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (settings.data) setCode(settings.data["google_site_verification"] ?? "");
  }, [settings.data]);

  const save = useMutation({
    mutationFn: async (value: string) => {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key: "google_site_verification", value, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Código de verificación guardado");
      queryClient.invalidateQueries({ queryKey: ["app_settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <section className="surface-panel mt-8 p-5 sm:p-7">
      <div><p className="eyebrow">Visibilidad</p><h2 className="text-xl font-bold">Verificación en Google Search Console</h2></div>
      <p className="mt-2 text-sm text-muted-foreground">
        Pega aquí el código de verificación que te da Google Search Console (método
        &quot;etiqueta HTML&quot;). Es el valor que aparece en{" "}
        <code className="text-xs">content=&quot;...&quot;</code> de la metaetiqueta. Al guardarlo,
        la etiqueta se incluirá automáticamente en la página principal del sitio.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Ejemplo: abc123XYZ..."
          className="max-w-md"
        />
        <Button
          disabled={save.isPending || settings.isLoading}
          onClick={() => save.mutate(code.trim())}
        >
          Guardar
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Pasos: en Google Search Console elige &quot;Agregar propiedad&quot; con la URL del sitio,
        selecciona el método &quot;Etiqueta HTML&quot;, copia el código y pégalo aquí. Después
        publica el sitio y vuelve a Search Console para presionar &quot;Verificar&quot;.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-panel p-5 transition-transform hover:-translate-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}
