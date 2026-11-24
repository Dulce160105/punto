import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeHttpsUrl } from "@/lib/public-settings";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

type Props = {
  businessId?: string;
  logoUrl?: string | null;
  onUploaded: (url: string) => void;
};

export function BusinessLogoUpload({ businessId, logoUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  async function upload(file?: File) {
    if (!businessId) {
      toast.error("Guarda primero los datos del negocio");
      return;
    }
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Solo puedes subir imágenes PNG o JPEG");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El logotipo debe pesar máximo 5 MB");
      return;
    }

    setUploading(true);
    try {
      const extension = file.type === "image/png" ? "png" : "jpg";
      const path = `${businessId}/logo-${crypto.randomUUID()}.${extension}`;
      const uploaded = await supabase.storage.from("business-logos").upload(path, file, { contentType: file.type });
      if (uploaded.error) throw uploaded.error;
      const signed = await supabase.storage.from("business-logos").createSignedUrl(path, TEN_YEARS);
      if (signed.error || !signed.data) throw signed.error ?? new Error("No se pudo abrir el logotipo");
      onUploaded(signed.data.signedUrl);
      toast.success("Logotipo listo. Guarda los cambios para aplicarlo");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir el logotipo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
      <div className="glass-soft grid h-14 w-14 shrink-0 place-items-center overflow-hidden text-xs text-muted-foreground">
        {logoUrl ? <img referrerPolicy="no-referrer" src={logoUrl} alt="Logotipo actual" className="h-full w-full object-contain p-1" /> : "Sin logo"}
      </div>
      <div className="min-w-0 space-y-2">
        <Input type="url" aria-label="URL del logotipo" placeholder="https://…/logo.png" value={url} onChange={e => setUrl(e.target.value)} />
        <Button type="button" variant="secondary" className="w-full" disabled={uploading} onClick={async () => {
          const valid = safeHttpsUrl(url);
          if (!valid) { toast.error("Introduce una URL HTTPS de imagen"); return; }
          setUploading(true);
          try {
            await new Promise<void>((resolve, reject) => { const img = new Image(); img.referrerPolicy = "no-referrer"; img.onload = () => resolve(); img.onerror = () => reject(new Error("No se pudo abrir la imagen")); img.src = valid; });
            onUploaded(valid); toast.success("Logotipo listo. Guarda los cambios");
          } catch { toast.error("El enlace no muestra una imagen accesible"); } finally { setUploading(false); }
        }}>Usar URL del logotipo</Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={(event) => upload(event.target.files?.[0])}
        />
        <Button type="button" variant="outline" className="w-full" disabled={uploading || !businessId} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {uploading ? "Subiendo…" : "Subir PNG o JPEG"}
        </Button>
        <p className="text-xs text-muted-foreground">Máximo 5 MB. Guarda el negocio antes de subirlo.</p>
      </div>
    </div>
  );
}