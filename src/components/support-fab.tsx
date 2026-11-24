import { MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-app-data";
import { contactLink } from "@/lib/public-settings";

export function SupportFab() {
  const { data } = useSettings();
  const link = contactLink(data);
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar a Punto"
      className="glass-panel glow-ring fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center text-primary transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
