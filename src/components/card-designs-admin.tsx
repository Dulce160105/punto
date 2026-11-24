import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Trash2, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCardDesigns } from "@/hooks/use-card-designs";
import { safeHttpsUrl } from "@/lib/public-settings";

export function CardDesignsAdmin() {
  const queryClient = useQueryClient();
  const designs = useCardDesigns();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const upload = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Ponle un nombre al diseño");
      const imageUrl = safeHttpsUrl(url);
      if (!imageUrl) throw new Error("Introduce una URL HTTPS de imagen");
      await new Promise<void>((resolve, reject) => { const image = new Image(); image.referrerPolicy = "no-referrer"; image.onload = () => resolve(); image.onerror = () => reject(new Error("El enlace no muestra una imagen accesible")); image.src = imageUrl; });
      const { error } = await supabase
        .from("card_designs")
        .insert({ name: name.trim(), image_url: imageUrl, storage_path: "" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Diseño agregado");
      setName("");
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["card_designs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async ({ id, path }: { id: string; path: string }) => {
      const { error } = await supabase.from("card_designs").delete().eq("id", id);
      if (error) throw error;
      if (path) await supabase.storage.from("card-designs").remove([path]);
    },
    onSuccess: () => {
      toast.success("Diseño eliminado");
      queryClient.invalidateQueries({ queryKey: ["card_designs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="glass-panel mt-8 p-6">
      <h2 className="text-lg font-semibold">Diseños de tarjeta</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Diseños compartidos para las tarjetas de todas las empresas.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del diseño" className="max-w-xs" />
        <Input
          type="url"
          aria-label="URL del diseño"
          placeholder="https://…/tarjeta.png"
          value={url}
          className="max-w-xs"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button disabled={upload.isPending} onClick={() => upload.mutate()}>
          {upload.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
          Agregar diseño
        </Button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {(designs.data ?? []).map((d) => (
          <div key={d.id} className="glass-soft overflow-hidden">
            <img referrerPolicy="no-referrer" src={d.image_url} alt={d.name} className="aspect-[1.6] w-full object-cover" />
            <div className="flex items-center justify-between p-3">
              <span className="text-sm">{d.name}</span>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Eliminar diseño"
                onClick={() => {
                  if (window.confirm(`¿Eliminar el diseño "${d.name}"?`)) remove.mutate({ id: d.id, path: d.storage_path });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
