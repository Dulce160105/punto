import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-app-data";
import { supabase } from "@/integrations/supabase/client";
import { safeHttpsUrl } from "@/lib/public-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { commercialFields, legalIdentityFields, legalInformation } from "@/lib/legal-settings";

const fields = [
  ["support_whatsapp", "WhatsApp (código de país y número)"],
  ["support_url", "Enlace de contacto HTTPS"],
  ...legalIdentityFields,
] as const;
export function PlatformSettingsAdmin() {
  const settings = useSettings();
  const client = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => { if (settings.data) setValues(settings.data); }, [settings.data]);
  const save = useMutation({
    mutationFn: async () => {
      if (values["support_url"] && !safeHttpsUrl(values["support_url"])) throw new Error("El enlace de contacto debe ser HTTPS");
      if (values["support_whatsapp"] && !/^\+?[\d\s()-]{8,25}$/.test(values["support_whatsapp"])) throw new Error("Revisa el número de WhatsApp");
      if (values["legal_email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values["legal_email"])) throw new Error("Revisa el correo legal");
      const keys = [...fields.map(([key]) => key), ...commercialFields.map(([key]) => key)];
      const { error } = await supabase.from("app_settings").upsert(keys.map(key => ({ key, value: values[key]?.trim() ?? "", updated_at: new Date().toISOString() })));
      if (error) throw error;
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ["app_settings"] }); toast.success("Información de Punto guardada"); },
    onError: (error: Error) => toast.error(error.message),
  });
  return <section className="surface-panel mt-8 space-y-5 p-5 sm:p-7">
    <h2 className="text-xl font-bold">Contacto, costos e información legal</h2>
    <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{label}</Label><Input id={key} type={key === "legal_email" ? "email" : key === "support_url" ? "url" : "text"} maxLength={500} value={values[key] ?? ""} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} /></div>)}</div>
    {commercialFields.map(([key, label]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{label}</Label><Textarea id={key} rows={5} maxLength={5000} value={values[key] ?? ""} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} /></div>)}
    <p className="text-xs text-muted-foreground">La información guardada es pública. Completa los datos del operador antes de ofrecer planes de pago.</p>
    {legalInformation(values).missing.length > 0 ? <div className="text-sm text-destructive"><p>Información pendiente de publicación:</p><ul className="list-disc pl-5">{legalInformation(values).missing.map(label => <li key={label}>{label}</li>)}</ul></div> : null}
    <p className="text-xs text-muted-foreground">Guardar esta información no certifica cumplimiento legal ni sustituye una revisión profesional.</p>
    <Button disabled={save.isPending || settings.isLoading} onClick={() => save.mutate()}>Guardar información de Punto</Button>
  </section>;
}