import type { ReactNode, HTMLAttributes } from "react";

export type BadgeColor = "danger" | "warning" | "success" | "info" | "neutral" | "brand";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  color?: BadgeColor;
  children: ReactNode;
}

const colors: Record<BadgeColor, string> = {
  danger: "bg-rose-100 text-rose-600",
  warning: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
  info: "bg-indigo-50 text-indigo-700",
  neutral: "bg-slate-100 text-slate-600",
  brand: "bg-indigo-50 text-[#5960A1]",
};

export default function Badge({
  color = "neutral",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors[color]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
