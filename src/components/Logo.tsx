import { cn } from "@/lib/utils";

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

const sizeMap: Record<LogoSize, { svg: number; wordmark: string; gap: string }> = {
  sm: { svg: 28, wordmark: "text-xl", gap: "gap-2" },
  md: { svg: 40, wordmark: "text-2xl", gap: "gap-2.5" },
  lg: { svg: 64, wordmark: "text-3xl", gap: "gap-3" },
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
  const headColor = variant === "dark" ? "hsl(160 84% 9%)" /* emerald-950 */ : "hsl(48 96% 89%)"; /* amber-200 */
  const antlerColor = "#F59E0B"; // amber-500
  const wordmarkColor = variant === "dark" ? "text-emerald-950" : "text-amber-50";
  const taglineColor = variant === "dark" ? "text-emerald-900/60" : "text-amber-200/70";

  return (
    <div className={cn("inline-flex items-center group", dims.gap, className)}>
      <svg
        width={dims.svg}
        height={dims.svg}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-[filter,transform] duration-300 group-hover:[filter:drop-shadow(0_0_8px_rgba(245,158,11,0.55))]"
        aria-hidden="true"
      >
        {/* Antlers — left */}
        <path
          d="M22 22 C 16 18, 12 12, 8 6 M22 22 C 14 22, 8 20, 4 16 M22 22 C 16 24, 10 26, 6 26 M22 22 C 18 16, 16 10, 14 4"
          stroke={antlerColor}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Antlers — right (mirrored) */}
        <path
          d="M42 22 C 48 18, 52 12, 56 6 M42 22 C 50 22, 56 20, 60 16 M42 22 C 48 24, 54 26, 58 26 M42 22 C 46 16, 48 10, 50 4"
          stroke={antlerColor}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Head — symmetric triangular muzzle */}
        <path
          d="M32 18 L46 28 L42 50 L32 58 L22 50 L18 28 Z"
          fill={headColor}
        />
        {/* Eyes */}
        <circle cx="26" cy="34" r="1.7" fill={antlerColor} />
        <circle cx="38" cy="34" r="1.7" fill={antlerColor} />
        {/* Nose */}
        <path d="M30 46 L34 46 L32 50 Z" fill={antlerColor} opacity="0.85" />
      </svg>

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