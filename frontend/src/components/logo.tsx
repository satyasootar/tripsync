import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { box: "size-7", text: "text-[10px]", ring: 1.5 },
  md: { box: "size-9", text: "text-xs", ring: 2 },
  lg: { box: "size-12", text: "text-sm", ring: 2.5 },
  xl: { box: "size-16", text: "text-base", ring: 3 },
};

export function Logo({ size = "md", className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("relative flex items-center justify-center", s.box, className)}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(210, 100%, 56%)" />
            <stop offset="100%" stopColor="hsl(250, 90%, 60%)" />
          </linearGradient>
          <linearGradient id="logo-ring" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(210, 100%, 70%)" />
            <stop offset="100%" stopColor="hsl(250, 80%, 72%)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#logo-grad)" />
        {/* Stylised compass / route pin */}
        {/* Location pin body */}
        <path
          d="M20 8c-4.97 0-9 3.87-9 8.64 0 6.48 9 15.36 9 15.36s9-8.88 9-15.36C29 11.87 24.97 8 20 8z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Inner circle of pin */}
        <circle cx="20" cy="17" r="4" fill="url(#logo-grad)" />
        {/* Small compass tick marks */}
        <rect x="19.25" y="10" width="1.5" height="3" rx="0.75" fill="url(#logo-grad)" opacity="0.7" />
        <rect x="19.25" y="21" width="1.5" height="3" rx="0.75" fill="url(#logo-grad)" opacity="0.7" />
        <rect x="13" y="16.25" width="3" height="1.5" rx="0.75" fill="url(#logo-grad)" opacity="0.7" />
        <rect x="24" y="16.25" width="3" height="1.5" rx="0.75" fill="url(#logo-grad)" opacity="0.7" />
      </svg>
    </div>
  );
}

interface LogoWithTextProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LogoWithText({ size = "md", className }: LogoWithTextProps) {
  const textSize = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={size} />
      <span className={cn("font-semibold tracking-tight", textSize[size])}>
        TripSync
      </span>
    </div>
  );
}
