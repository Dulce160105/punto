import { cn } from "@/lib/utils";
import { mascotIdentity } from "@/lib/public-settings";
import type { CSSProperties } from "react";

const shapes = ["rounded-[42%_42%_34%_34%]", "rounded-[48%_48%_30%_30%]", "rounded-[38%_46%_38%_32%]"];

export function CustomerMascot({ seed, size = "md", active = false }: { seed: string; size?: "sm" | "md" | "lg"; active?: boolean }) {
  const identity = mascotIdentity(seed);
  const shape = shapes[identity.shape];
  const dimensions = size === "lg" ? "h-44 w-36" : size === "sm" ? "h-14 w-12" : "h-20 w-16";

  return (
    <div className={cn("mascot-stage shrink-0", active && "is-active")} aria-hidden="true">
      <div style={{ "--mascot-hue": identity.hue, "--mascot-delay": `${identity.delay}s` } as CSSProperties} className={cn("mascot-body relative", dimensions, shape)}>
        <span className="mascot-ear mascot-ear-left" />
        <span className="mascot-ear mascot-ear-right" />
        <span className="mascot-face">
          <span className="mascot-eye" />
          <span className="mascot-eye" />
        </span>
        <span className="mascot-shine" />
      </div>
      <span className="mascot-shadow" />
    </div>
  );
}