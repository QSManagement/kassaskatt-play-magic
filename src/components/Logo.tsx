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
 * tagline, so we render it as a single image. A light backing keeps the
 * blue wordmark and gold tagline readable on dark backgrounds.
 */
export function Logo({
  size = "sm",
  variant = "dark",
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex max-w-full items-center", sizeMap[size], variant === "light" && "drop-shadow-[0_1px_6px_rgba(255,255,255,0.25)]", className)}>
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