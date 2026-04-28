import { cn } from "@/lib/utils";
import logoMark from "@/assets/qlasskassan-mark.png";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "light" | "dark";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

const sizeMap: Record<LogoSize, { mark: number; wordmark: string; gap: string }> = {
  sm: { mark: 36, wordmark: "text-xl", gap: "gap-2.5" },
  md: { mark: 52, wordmark: "text-2xl", gap: "gap-3" },
  lg: { mark: 80, wordmark: "text-3xl", gap: "gap-4" },
};

/**
 * Qlasskassan logo: minimalist nordic moose head + amber antlers + wordmark.
 * Inline SVG so it can be re-coloured per variant and hovered.
 */
export function Logo({
  size = "sm",
  variant = "dark",
  showWordmark = true,
  showTagline = false,
  className,
  wordmarkClassName,
}: LogoProps) {
  const dims = sizeMap[size];
  const wordmarkColor = variant === "dark" ? "text-emerald-950" : "text-amber-50";
  const taglineColor = variant === "dark" ? "text-emerald-900/60" : "text-amber-200/70";

  return (
    <div className={cn("inline-flex items-center group", dims.gap, className)}>
      <img
        src={logoMark}
        alt="Qlasskassan"
        width={dims.mark}
        height={dims.mark}
        className="shrink-0 object-contain transition-[filter,transform] duration-300 group-hover:[filter:drop-shadow(0_0_10px_rgba(245,158,11,0.55))]"
        style={{ width: dims.mark, height: dims.mark }}
        draggable={false}
      />

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight", dims.wordmark, wordmarkColor, wordmarkClassName)}>
            Qlasskassan
          </span>
          {showTagline && (
            <span className={cn("uppercase tracking-[0.18em] mt-1 text-[10px] font-medium", taglineColor)}>
              Sveriges starkaste insamlingskoncept
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;