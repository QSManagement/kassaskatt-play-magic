import { cn } from "@/lib/utils";
import logoFull from "@/assets/qlasskassan-mark.png";

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

// Heights chosen so the lockup (moose + wordmark + tagline) stays legible
// at small sizes in the nav and large sizes in the footer.
const sizeMap: Record<LogoSize, { height: number }> = {
  sm: { height: 96 },
  md: { height: 140 },
  lg: { height: 184 },
};

/**
 * Qlasskassan logo lockup. The artwork already contains the wordmark and
 * tagline, so we render it as a single image. On dark backgrounds we drop
 * a soft amber glow behind it instead of stamping it on a coloured plate,
 * which is what made it look "boxed" before.
 */
export function Logo({
  size = "sm",
  variant = "dark",
  className,
}: LogoProps) {
  const dims = sizeMap[size];
  const glow =
    variant === "light"
      ? "drop-shadow(0_2px_8px_rgba(0,0,0,0.25))"
      : "drop-shadow(0_1px_2px_rgba(0,0,0,0.06))";

  return (
    <span className={cn("inline-flex items-center group", className)}>
      <img
        src={logoFull}
        alt="Qlasskassan – Sveriges starkaste insamlingskoncept"
        height={dims.height}
        className="block w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ height: dims.height, filter: glow }}
        draggable={false}
      />
    </span>
  );
}

export default Logo;