import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BusinessQrCodes({ businessId, scanCode, approved }: { businessId: string; scanCode: string; approved: boolean }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(new URL(import.meta.env.BASE_URL, window.location.origin).href.replace(/\/$/, "")), []);
  if (!origin) return null;

  const items = [
    { id: "qr-join", title: "QR 1 · Crear tarjeta", text: "Tus clientes lo escanean para obtener su tarjeta.", url: `${origin}/unirse/${businessId}` },
    { id: "qr-scan", title: "QR 2 · Sumar punto", text: "Lo escanean en cada visita. Máximo 1 punto cada 24 horas.", url: `${origin}/sumar/${scanCode}` },
  ];

  function download(id: string) {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${id}.png`;
    a.click();
  }

  return (
    <section className="glass-panel mt-6 space-y-4 p-6">
      <h2 className="text-lg font-semibold">Tus códigos QR</h2>
      {!approved ? (
        <p className="text-sm text-muted-foreground">Los códigos funcionarán cuando tu empresa sea aprobada.</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="glass-soft space-y-3 p-4 text-center">
            <p className="font-medium">{item.title}</p>
            <div className="mx-auto w-full max-w-[204px] rounded-xl bg-foreground p-3">
              <QRCodeCanvas id={item.id} value={item.url} size={180} marginSize={1} className="h-auto w-full" />
            </div>
            <p className="text-xs text-muted-foreground">{item.text}</p>
            <p className="break-all text-xs text-muted-foreground">{item.url}</p>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => download(item.id)}>
                <Download className="mr-1 h-4 w-4" />Descargar
              </Button>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(item.url); toast.success("Enlace copiado"); }}>
                <Copy className="mr-1 h-4 w-4" />Copiar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
