import { cn } from "@/lib/utils";
import logoFull from "@/assets/qlasskassan-logo-2026.png";

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

const sizeMap: Record<LogoSize, string> = {
  sm: "w-[180px] sm:w-[210px]",
  md: "w-[260px] sm:w-[300px]",
  lg: "w-[300px] sm:w-[380px]",
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
  return (
    <span className={cn("inline-flex max-w-full items-center", sizeMap[size], variant === "light" && "rounded-md bg-background p-2", className)}>
      <img
        src={logoFull}
        alt="Qlasskassan – Sveriges starkaste insamlingskoncept"
        width={1509}
        height={413}
        className="block h-auto w-full object-contain"
        draggable={false}
      />
    </span>
  );
}

export default Logo;