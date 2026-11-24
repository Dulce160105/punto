import { initials } from "@/lib/format";
import { safeHttpsUrl } from "@/lib/public-settings";
import type { CSSProperties } from "react";

export type CardTemplate = "aurora" | "midnight" | "frost" | "pulse";

export const CARD_TEMPLATES: { id: CardTemplate; label: string }[] = [
  { id: "aurora", label: "Aurora" },
  { id: "midnight", label: "Medianoche" },
  { id: "frost", label: "Escarcha" },
  { id: "pulse", label: "Pulso" },
];

const templateBackground: Record<CardTemplate, string> = { aurora: "var(--card-aurora)", midnight: "var(--card-midnight)", frost: "var(--card-frost)", pulse: "var(--card-pulse)" };

type Props = {
  businessName: string;
  logoUrl?: string | null;
  template?: string | null;
  pointsStyle?: string | null;
  pointsRequired: number;
  points?: number;
  accentColor?: string | null;
  rewardDescription?: string | null;
  customerName?: string;
  logoPosition?: string | null;
  logoSize?: string | null;
};

const logoPositionClass: Record<string, string> = {
  "top-left": "left-4 top-4 sm:left-5 sm:top-5",
  "top-center": "left-1/2 top-4 -translate-x-1/2 sm:top-5",
  "top-right": "right-4 top-4 sm:right-5 sm:top-5",
};

const logoSizeClass: Record<string, string> = {
  small: "h-9 w-9 sm:h-10 sm:w-10",
  medium: "h-11 w-11 sm:h-12 sm:w-12",
  large: "h-14 w-14 sm:h-16 sm:w-16",
};

export function LoyaltyCardPreview({
  businessName,
  logoUrl,
  template = "aurora",
  pointsStyle = "circles",
  pointsRequired,
  points = 0,
  accentColor = "#00B4D8",
  rewardDescription,
  customerName = "Tu cliente",
  logoPosition = "top-left",
  logoSize = "medium",
}: Props) {
  const tpl = (template ?? "aurora") as CardTemplate;
  const imageUrl = safeHttpsUrl(template ?? "");
  const isImage = Boolean(imageUrl);
  const total = Math.max(1, Math.min(20, pointsRequired || 10));
  const filled = Math.min(points, total);

  return (
    <div
      className={`glass-panel relative aspect-[1.586/1] w-full overflow-hidden p-4 sm:p-5 ${isImage ? "image-loyalty-card" : ""}`}
      style={{ backgroundImage: isImage ? "var(--image-card-overlay)" : templateBackground[tpl] ?? templateBackground.aurora, "--customer-accent": /^#[0-9a-f]{6}$/i.test(accentColor ?? "") ? accentColor : "var(--primary)" } as CSSProperties}
    >
      {isImage ? <><img referrerPolicy="no-referrer" src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" /><span className="image-card-shade absolute inset-0" /></> : null}
      <div className={`absolute z-10 ${logoPositionClass[logoPosition ?? ""] ?? logoPositionClass["top-left"]}`}>
        <div className={`glass-soft flex items-center justify-center overflow-hidden text-sm font-semibold ${logoSizeClass[logoSize ?? ""] ?? logoSizeClass["medium"]}`}>
          {logoUrl ? <img referrerPolicy="no-referrer" src={logoUrl} alt={businessName} className="h-full w-full object-contain p-1" /> : initials(businessName)}
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between pt-[4.25rem] sm:pt-[4.75rem]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight sm:text-base">{businessName || "Tu empresa"}</p>
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{customerName}</p>
          </div>
          <span className="glass-soft shrink-0 px-2 py-1 text-[9px] text-muted-foreground sm:text-[10px]">Digital</span>
        </div>
        <div>
        {pointsStyle === "numeric" ? (
          <div className="flex items-end gap-2">
            <span className="card-accent-text text-3xl font-semibold sm:text-4xl">
              {filled}
            </span>
            <span className="pb-1 text-xs text-muted-foreground sm:text-sm">/ {total} puntos</span>
          </div>
        ) : (
          <div className="grid max-w-[15rem] grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: total }).map((_, index) => (
              <span
                key={index}
                className={`card-point aspect-square w-full rounded-full border transition-colors ${index < filled ? "is-filled" : ""}`}
              />
            ))}
          </div>
        )}
        </div>
        <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
          {rewardDescription?.trim() ? rewardDescription : "Describe aquí el premio al completar la tarjeta."}
        </p>
      </div>
    </div>
  );
}
